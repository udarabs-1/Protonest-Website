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
	ResearchTimeout = 15 * time.Second
)

// CreateResearch creates a new research article
func CreateResearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ResearchTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	var req models.ResearchRequest
	var err error

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		req.Title = c.PostForm("title")
		req.Content = c.PostForm("content")
		req.Published = c.PostForm("published") == "true"

		if req.Title == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Title is required"))
			return
		}
		if req.Content == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Content is required"))
			return
		}
	} else {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
			return
		}
	}

	azureService, err := services.NewAzureStorageService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to initialize storage service"))
		return
	}

	// Handle cover image upload
	coverImageURL := ""
	if file, err := c.FormFile("cover_image"); err == nil {
		coverImageURL, err = azureService.UploadResearchDocument(ctx, file, "cover-image")
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to upload cover image"))
			return
		}
	}

	research := models.Research{
		Title:      req.Title,
		Slug:       models.GenerateResearchSlug(req.Title),
		CoverImage: coverImageURL,
		Content:    req.Content,
		Author:     adminEmail.(string),
		Published:  req.Published,
		CreatedAt:  time.Now().Format(time.RFC3339),
		UpdatedAt:  time.Now().Format(time.RFC3339),
	}

	if req.Published {
		research.PublishedAt = time.Now().Format(time.RFC3339)
	}

	result, err := database.ResearchCollection.InsertOne(ctx, research)
	if err != nil {
		// Clean up uploaded image if database operation fails
		if coverImageURL != "" {
			if delErr := azureService.DeleteResearchDocument(ctx, coverImageURL); delErr != nil {
				fmt.Printf("Warning: failed to delete uploaded image after db error: %v\n", delErr)
			}
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to create research article"))
		return
	}

	research.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"Research article created successfully",
		research.ToResponse(),
	))
}

// UpdateResearch updates an existing research article
func UpdateResearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ResearchTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	researchID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(researchID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid research ID"))
		return
	}

	var req models.ResearchRequest

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		req.Title = c.PostForm("title")
		req.Content = c.PostForm("content")
		req.Published = c.PostForm("published") == "true"

		if req.Title == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Title is required"))
			return
		}
		if req.Content == "" {
			c.JSON(http.StatusBadRequest, models.FailResponse("Content is required"))
			return
		}
	} else {
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
			return
		}
	}

	azureService, err := services.NewAzureStorageService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to initialize storage service"))
		return
	}

	var existingResearch models.Research
	err = database.ResearchCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingResearch)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Research article not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	// Handle cover image update
	coverImageURL := existingResearch.CoverImage
	if file, err := c.FormFile("cover_image"); err == nil {
		newImageURL, err := azureService.UploadResearchDocument(ctx, file, "cover-image")
		if err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to upload new cover image"))
			return
		}

		if existingResearch.CoverImage != "" {
			if err := azureService.DeleteResearchDocument(ctx, existingResearch.CoverImage); err != nil {
				fmt.Printf("Warning: failed to delete old cover image: %v\n", err)
			}
		}

		coverImageURL = newImageURL
	}

	update := bson.M{
		"$set": bson.M{
			"title":       req.Title,
			"slug":        models.GenerateResearchSlug(req.Title),
			"cover_image": coverImageURL,
			"content":     req.Content,
			"published":   req.Published,
			"author":      adminEmail.(string),
			"updated_at":  time.Now().Format(time.RFC3339),
		},
	}

	if req.Published && existingResearch.PublishedAt == "" {
		update["$set"].(bson.M)["published_at"] = time.Now().Format(time.RFC3339)
	}

	_, err = database.ResearchCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		update,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to update research article"))
		return
	}

	var updatedResearch models.Research
	err = database.ResearchCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedResearch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch updated research"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Research article updated successfully",
		updatedResearch.ToResponse(),
	))
}

// GetResearch retrieves a single research article
func GetResearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ResearchTimeout)
	defer cancel()

	slug := c.Param("slug")

	var research models.Research
	err := database.ResearchCollection.FindOne(ctx, bson.M{"slug": slug}).Decode(&research)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Research article not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Research article fetched successfully",
		research.ToResponse(),
	))
}

// ListResearch retrieves all research articles (with optional published filter)
func ListResearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ResearchTimeout)
	defer cancel()

	publishedOnly := c.Query("published") == "true"

	filter := bson.M{}
	if publishedOnly {
		filter["published"] = true
	}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.ResearchCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch research articles"))
		return
	}
	defer cursor.Close(ctx)

	var researchList []models.ResearchResponse
	for cursor.Next(ctx) {
		var research models.Research
		if err := cursor.Decode(&research); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to decode research article"))
			return
		}
		researchList = append(researchList, research.ToResponse())
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Research articles fetched successfully",
		researchList,
	))
}

// DeleteResearch deletes a research article
func DeleteResearch(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ResearchTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}
	_ = adminEmail

	researchID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(researchID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid research ID"))
		return
	}

	var research models.Research
	err = database.ResearchCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&research)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Research article not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	azureService, err := services.NewAzureStorageService()
	if err == nil && research.CoverImage != "" {
		if err := azureService.DeleteResearchDocument(ctx, research.CoverImage); err != nil {
			fmt.Printf("Warning: failed to delete cover image: %v\n", err)
		}
	}

	_, err = database.ResearchCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to delete research article"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Research article deleted successfully",
		nil,
	))
}
