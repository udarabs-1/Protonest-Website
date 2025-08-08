package controllers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/models"
	"github.com/shafeekms10/protonest-backend/services"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	BlogTimeout = 15 * time.Second
)

// CreateBlog creates a new blog post - supports both JSON and form-data
func CreateBlog(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), BlogTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	var req models.BlogRequest
	var err error

	// Check content type to determine how to parse the request
	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		// Handle form-data
		req.Title = c.PostForm("title")
		req.Content = c.PostForm("content")
		req.Published = c.PostForm("published") == "true"

		// Validate required fields
		if req.Title == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Title is required"))
			return
		}
		if req.Content == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Content is required"))
			return
		}
	} else {
		// Handle JSON
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
			return
		}
	}

	// Initialize Azure Storage Service
	azureService, err := services.NewAzureStorageService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to initialize storage service"))
		return
	}

	// Handle file upload if exists (only available with form-data)
	coverImageURL := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		coverImageURL, err = azureService.UploadBlogImage(ctx, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to upload cover image"))
			return
		}
	}

	// Create blog post
	blog := models.Blog{
		Title:      req.Title,
		Slug:       models.GenerateBlogSlug(req.Title),
		CoverImage: coverImageURL,
		Content:    req.Content,
		Author:     adminEmail.(string),
		Published:  req.Published,
		CreatedAt:  time.Now().Format(time.RFC3339),
		UpdatedAt:  time.Now().Format(time.RFC3339),
	}

	if req.Published {
		blog.PublishedAt = time.Now().Format(time.RFC3339)
	}

	result, err := database.BlogCollection.InsertOne(ctx, blog)
	if err != nil {
		// Clean up uploaded image if database operation fails
		if coverImageURL != "" {
			if delErr := azureService.DeleteBlogImage(ctx, coverImageURL); delErr != nil {
				fmt.Printf("Warning: failed to delete uploaded image after db error: %v\n", delErr)
			}
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to create blog post"))
		return
	}

	blog.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"Blog post created successfully",
		blog.ToResponse(),
	))
}

// UpdateBlog updates an existing blog post - supports both JSON and form-data
func UpdateBlog(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), BlogTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	blogID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(blogID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid blog ID"))
		return
	}

	var req models.BlogRequest

	// Check content type to determine how to parse the request
	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		// Handle form-data
		req.Title = c.PostForm("title")
		req.Content = c.PostForm("content")
		req.Published = c.PostForm("published") == "true"

		// Validate required fields
		if req.Title == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Title is required"))
			return
		}
		if req.Content == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Content is required"))
			return
		}
	} else {
		// Handle JSON
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
			return
		}
	}

	// Initialize Azure Storage Service
	azureService, err := services.NewAzureStorageService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to initialize storage service"))
		return
	}

	// Get existing blog
	var existingBlog models.Blog
	err = database.BlogCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingBlog)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Blog post not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	// Handle file upload if exists (only available with form-data)
	coverImageURL := existingBlog.CoverImage
	if file, err := c.FormFile("cover_image"); err == nil {
		// Upload new image first
		newImageURL, err := azureService.UploadBlogImage(ctx, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to upload new cover image"))
			return
		}

		// Delete old image only after successful upload
		if existingBlog.CoverImage != "" {
			if err := azureService.DeleteBlogImage(ctx, existingBlog.CoverImage); err != nil {
				fmt.Printf("Warning: failed to delete old cover image: %v\n", err)
			}
		}

		coverImageURL = newImageURL
	}

	// Update blog post
	update := bson.M{
		"$set": bson.M{
			"title":       req.Title,
			"slug":        models.GenerateBlogSlug(req.Title),
			"cover_image": coverImageURL,
			"content":     req.Content,
			"published":   req.Published,
			"author":      adminEmail.(string),
			"updated_at":  time.Now().Format(time.RFC3339),
		},
	}

	if req.Published && existingBlog.PublishedAt == "" {
		update["$set"].(bson.M)["published_at"] = time.Now().Format(time.RFC3339)
	}

	_, err = database.BlogCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		update,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to update blog post"))
		return
	}

	// Get updated blog
	var updatedBlog models.Blog
	err = database.BlogCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedBlog)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch updated blog"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Blog post updated successfully",
		updatedBlog.ToResponse(),
	))
}

// GetBlog retrieves a single blog post
func GetBlog(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), BlogTimeout)
	defer cancel()

	slug := c.Param("slug")

	var blog models.Blog
	err := database.BlogCollection.FindOne(ctx, bson.M{"slug": slug}).Decode(&blog)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Blog post not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Blog post fetched successfully",
		blog.ToResponse(),
	))
}

// ListBlogs retrieves all blog posts (with optional published filter)
func ListBlogs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), BlogTimeout)
	defer cancel()

	publishedOnly := c.Query("published") == "true"

	filter := bson.M{}
	if publishedOnly {
		filter["published"] = true
	}

	// Add sorting by creation date (newest first) - Fixed: using keyed fields
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.BlogCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch blog posts"))
		return
	}
	defer cursor.Close(ctx)

	var blogs []models.BlogResponse
	for cursor.Next(ctx) {
		var blog models.Blog
		if err := cursor.Decode(&blog); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to decode blog post"))
			return
		}
		blogs = append(blogs, blog.ToResponse())
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Blog posts fetched successfully",
		blogs,
	))
}

// DeleteBlog deletes a blog post
func DeleteBlog(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), BlogTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}
	_ = adminEmail // Just to show we have it if needed for logging

	blogID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(blogID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid blog ID"))
		return
	}

	var blog models.Blog
	err = database.BlogCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&blog)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Blog post not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	// Initialize Azure Storage Service
	azureService, err := services.NewAzureStorageService()
	if err == nil && blog.CoverImage != "" {
		if err := azureService.DeleteBlogImage(ctx, blog.CoverImage); err != nil {
			fmt.Printf("Warning: failed to delete cover image: %v\n", err)
		}
	}

	_, err = database.BlogCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to delete blog post"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Blog post deleted successfully",
		nil,
	))
}

// GetBlogImageURL generates a temporary access URL for blog images
func GetBlogImageURL(c *gin.Context) {
	// Removed unused ctx variable since it's not needed in this function
	imagePath := c.Param("path")
	if imagePath == "" {
		c.JSON(http.StatusBadRequest, models.FailResponse("Image path is required"))
		return
	}

	azureService, err := services.NewAzureStorageService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to initialize storage service"))
		return
	}

	// Generate a 1-hour valid URL
	imageURL, err := azureService.GenerateSASURL(services.BlogContainer, imagePath, time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to generate image URL"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Image URL generated",
		gin.H{"url": imageURL},
	))
}
