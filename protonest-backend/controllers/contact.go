package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/database"
	"github.com/shafeekms10/protonest-backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	ContactTimeout = 10 * time.Second
)

// ContactUs handles the contact form submission
func ContactUs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ContactTimeout)
	defer cancel()

	var req models.ContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Create new contact entry
	contact := models.Contact{
		Name:      req.Name,
		Email:     req.Email,
		Message:   req.Message,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	result, err := database.ContactCollection.InsertOne(ctx, contact)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to save contact message"))
		return
	}

	contact.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"Thank you for contacting us! We'll get back to you soon.",
		contact.ToResponse(),
	))
}

// GetContacts returns all contact messages (admin only)
func GetContacts(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), ContactTimeout)
	defer cancel()

	cursor, err := database.ContactCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch contacts"))
		return
	}
	defer cursor.Close(ctx)

	var contacts []models.ContactResponse
	for cursor.Next(ctx) {
		var contact models.Contact
		if err := cursor.Decode(&contact); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to decode contact"))
			return
		}
		contacts = append(contacts, contact.ToResponse())
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Contacts fetched successfully",
		contacts,
	))
}
