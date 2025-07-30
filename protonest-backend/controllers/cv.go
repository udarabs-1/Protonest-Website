package controllers

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/services"
	"github.com/shafeekms10/protonest-backend/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CVTimeout      = 60 * time.Second
	MaxCVSize      = 5 << 20 // 5MB
	AllowedCVTypes = ".pdf,.docx"
)

func UploadCV(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), CVTimeout)
	defer cancel()

	// Get user claims
	claims, exists := c.Get("jwt_claims")
	if !exists {
		respondError(c, http.StatusUnauthorized, "Authentication required")
		return
	}

	jwtClaims, ok := claims.(*utils.Claims)
	if !ok {
		respondError(c, http.StatusInternalServerError, "Invalid token format")
		return
	}

	// Parse form data
	var req models.CVRequest
	if err := c.ShouldBind(&req); err != nil {
		respondError(c, http.StatusBadRequest, fmt.Sprintf("Invalid form data: %v", err))
		return
	}

	// Validate NDA acknowledgment
	if !req.NDAAcknowledged {
		respondError(c, http.StatusBadRequest, "You must acknowledge the NDA agreement")
		return
	}

	// Validate and process CV file
	cvFile, err := validateCVFile(c)
	if err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Initialize Azure storage service
	azureService, err := services.NewAzureStorageService()
	if err != nil {
		respondError(c, http.StatusInternalServerError, "Failed to initialize storage service")
		return
	}

	// Upload to cloud storage
	cvFileURL, err := azureService.UploadCV(ctx, cvFile, jwtClaims.UserID)
	if err != nil {
		respondError(c, http.StatusInternalServerError, "Failed to upload CV file")
		return
	}

	// Create CV record
	cv, err := createCVRecord(ctx, jwtClaims, req, cvFileURL)
	if err != nil {
		if delErr := azureService.DeleteCV(ctx, cvFileURL); delErr != nil {
			fmt.Printf("Failed to delete CV file after DB error: %v\n", delErr)
		}
		respondError(c, http.StatusInternalServerError, "Failed to save CV data")
		return
	}

	respondSuccess(c, http.StatusCreated, "CV uploaded successfully", cv.ToResponse())
}

// Helper functions

func validateCVFile(c *gin.Context) (*multipart.FileHeader, error) {
	file, err := c.FormFile("cv_file")
	if err != nil {
		return nil, fmt.Errorf("CV file is required")
	}

	if file.Size > MaxCVSize {
		return nil, fmt.Errorf("CV file too large (max %dMB)", MaxCVSize>>20)
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !strings.Contains(AllowedCVTypes, ext) {
		return nil, fmt.Errorf("only %s files are allowed", AllowedCVTypes)
	}

	return file, nil
}

func createCVRecord(
	ctx context.Context,
	claims *utils.Claims,
	req models.CVRequest,
	cvFileURL string,
) (*models.CV, error) {
	cv := models.CV{
		UserID:          claims.UserID,
		FullName:        req.FullName,
		Email:           req.Email,
		PhoneNumber:     req.PhoneNumber,
		Location:        req.Location,
		NDAAcknowledged: req.NDAAcknowledged,
		CVFileURL:       cvFileURL,
		Expertise:       req.Expertise, // Expertise now comes directly from the request
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}

	result, err := database.CVCollection.InsertOne(ctx, cv)
	if err != nil {
		return nil, fmt.Errorf("database insert failed: %v", err)
	}

	cv.ID = result.InsertedID.(primitive.ObjectID)
	return &cv, nil
}

func respondError(c *gin.Context, code int, message string) {
	c.JSON(code, gin.H{"status": "error", "message": message})
}

func respondSuccess(c *gin.Context, code int, message string, data interface{}) {
	c.JSON(code, gin.H{"status": "success", "message": message, "data": data})
}
