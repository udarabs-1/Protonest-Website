package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/bloberror"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/sas"
)

type AzureStorageService struct {
	client      *azblob.Client
	accountName string
}

// Container names as constants for type safety
const (
	BlogContainer     = "blog-images"
	CVContainer       = "cv-files"
	ResearchContainer = "research-images"
)

func NewAzureStorageService() (*AzureStorageService, error) {
	accountName := os.Getenv("AZURE_STORAGE_ACCOUNT_NAME")
	accountKey := os.Getenv("AZURE_STORAGE_ACCOUNT_KEY")

	if accountName == "" || accountKey == "" {
		return nil, fmt.Errorf("azure storage credentials not configured")
	}

	credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create Azure credentials: %v", err)
	}

	serviceURL := fmt.Sprintf("https://%s.blob.core.windows.net/", accountName)
	client, err := azblob.NewClientWithSharedKeyCredential(serviceURL, credential, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create Azure client: %v", err)
	}

	// Initialize containers if they don't exist
	ctx := context.Background()
	for _, container := range []string{BlogContainer, CVContainer, ResearchContainer} {
		_, err = client.CreateContainer(ctx, container, nil)
		if err != nil && !bloberror.HasCode(err, bloberror.ContainerAlreadyExists) {
			return nil, fmt.Errorf("failed to create container %s: %v", container, err)
		}
	}

	return &AzureStorageService{
		client:      client,
		accountName: accountName,
	}, nil
}

// UploadBlogImage uploads a blog cover image
func (s *AzureStorageService) UploadBlogImage(ctx context.Context, file *multipart.FileHeader) (string, error) {
	return s.uploadFile(ctx, file, BlogContainer, "blog-cover")
}

// UploadCV uploads a user's CV/resume
func (s *AzureStorageService) UploadCV(ctx context.Context, file *multipart.FileHeader, userID string) (string, error) {
	prefix := fmt.Sprintf("user-%s-cv", userID)
	return s.uploadFile(ctx, file, CVContainer, prefix)
}

// UploadResearchDocument uploads a research document
func (s *AzureStorageService) UploadResearchDocument(ctx context.Context, file *multipart.FileHeader, researchID string) (string, error) {
	prefix := fmt.Sprintf("research-%s", researchID)
	return s.uploadFile(ctx, file, ResearchContainer, prefix)
}

// Generic file upload implementation
func (s *AzureStorageService) uploadFile(ctx context.Context, file *multipart.FileHeader, container string, prefix string) (string, error) {
	fileContent, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer fileContent.Close()

	// Generate unique filename with original extension
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s-%d%s", prefix, time.Now().UnixNano(), ext)
	blobName := filename

	// Get content type with fallback
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Upload the file with simplified options to avoid BlobHTTPHeaders issue
	_, err = s.client.UploadStream(ctx, container, blobName, fileContent, nil)
	if err != nil {
		return "", fmt.Errorf("failed to upload file to container %s: %v", container, err)
	}

	// Return the blob URL
	return s.generateBlobURL(container, blobName), nil
}

// DeleteBlogImage deletes a blog cover image
func (s *AzureStorageService) DeleteBlogImage(ctx context.Context, blobURL string) error {
	return s.deleteFile(ctx, blobURL, BlogContainer)
}

// DeleteCV deletes a user's CV
func (s *AzureStorageService) DeleteCV(ctx context.Context, blobURL string) error {
	return s.deleteFile(ctx, blobURL, CVContainer)
}

// DeleteResearchDocument deletes a research document
func (s *AzureStorageService) DeleteResearchDocument(ctx context.Context, blobURL string) error {
	return s.deleteFile(ctx, blobURL, ResearchContainer)
}

// Generic file deletion implementation
func (s *AzureStorageService) deleteFile(ctx context.Context, blobURL string, expectedContainer string) error {
	parsedURL, err := url.Parse(blobURL)
	if err != nil {
		return fmt.Errorf("invalid blob URL: %v", err)
	}

	// Extract container and blob name from URL
	pathParts := strings.SplitN(strings.TrimPrefix(parsedURL.Path, "/"), "/", 2)
	if len(pathParts) < 2 {
		return fmt.Errorf("invalid blob URL format")
	}

	container := pathParts[0]
	blobName := pathParts[1]

	// Verify container matches expected
	if container != expectedContainer {
		return fmt.Errorf("URL container %s doesn't match expected %s", container, expectedContainer)
	}

	// Delete the blob
	_, err = s.client.DeleteBlob(ctx, container, blobName, nil)
	if err != nil {
		return fmt.Errorf("failed to delete blob: %v", err)
	}

	return nil
}

// GenerateSASURL creates a temporary access URL for private blobs
func (s *AzureStorageService) GenerateSASURL(container string, blobName string, expiry time.Duration) (string, error) {
	// Create SAS permissions
	permissions := sas.BlobPermissions{
		Read: true,
	}

	startTime := time.Now().UTC()
	expiryTime := startTime.Add(expiry)

	// Get the blob client
	blobClient := s.client.ServiceClient().NewContainerClient(container).NewBlobClient(blobName)

	// Generate SAS URL using the correct API from the blob package
	sasURL, err := blobClient.GetSASURL(permissions, expiryTime, &blob.GetSASURLOptions{
		StartTime: &startTime,
	})
	if err != nil {
		return "", fmt.Errorf("failed to generate SAS URL: %v", err)
	}

	return sasURL, nil
}

// FileExists checks if a blob exists
func (s *AzureStorageService) FileExists(ctx context.Context, container string, blobName string) (bool, error) {
	// Use the blob client to get properties
	blobClient := s.client.ServiceClient().NewContainerClient(container).NewBlobClient(blobName)
	_, err := blobClient.GetProperties(ctx, nil)
	if err != nil {
		if bloberror.HasCode(err, bloberror.BlobNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// Helper to generate blob URL
func (s *AzureStorageService) generateBlobURL(container string, blobName string) string {
	return fmt.Sprintf("https://%s.blob.core.windows.net/%s/%s",
		s.accountName,
		container,
		blobName,
	)
}
