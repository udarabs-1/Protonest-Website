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
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	SubscriptionTimeout = 10 * time.Second
)

// Subscribe handles new subscriptions
func Subscribe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), SubscriptionTimeout)
	defer cancel()

	var req models.SubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Check if subscription already exists
	var existingSub models.Subscription
	err := database.SubscriptionCollection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existingSub)

	if err == nil {
		// Update existing subscription if career updates preference changed
		if existingSub.CareerUpdates != req.CareerUpdates {
			update := bson.M{
				"$set": bson.M{
					"career_updates": req.CareerUpdates,
				},
			}

			_, err = database.SubscriptionCollection.UpdateOne(
				ctx,
				bson.M{"_id": existingSub.ID},
				update,
			)
			if err != nil {
				c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to update subscription"))
				return
			}

			// Get updated subscription
			err = database.SubscriptionCollection.FindOne(
				ctx,
				bson.M{"_id": existingSub.ID},
			).Decode(&existingSub)
			if err != nil {
				c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch updated subscription"))
				return
			}

			c.JSON(http.StatusOK, models.SuccessResponse(
				"Subscription preferences updated",
				existingSub.ToResponse(),
			))
			return
		}

		c.JSON(http.StatusOK, models.SuccessResponse(
			"You're already subscribed",
			existingSub.ToResponse(),
		))
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database query failed"))
		return
	}

	// Create new subscription
	subscription := models.Subscription{
		Name:          req.Name,
		Email:         req.Email,
		CareerUpdates: req.CareerUpdates,
		CreatedAt:     time.Now().Format(time.RFC3339),
	}

	result, err := database.SubscriptionCollection.InsertOne(ctx, subscription)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to create subscription"))
		return
	}

	subscription.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"Thank you for subscribing!",
		subscription.ToResponse(),
	))
}

// GetSubscriptions returns all subscriptions (admin only)
func GetSubscriptions(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), SubscriptionTimeout)
	defer cancel()

	cursor, err := database.SubscriptionCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch subscriptions"))
		return
	}
	defer cursor.Close(ctx)

	var subscriptions []models.SubscriptionResponse
	for cursor.Next(ctx) {
		var sub models.Subscription
		if err := cursor.Decode(&sub); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to decode subscription"))
			return
		}
		subscriptions = append(subscriptions, sub.ToResponse())
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Subscriptions fetched successfully",
		subscriptions,
	))
}

// GetSubscriptionCount returns count of subscriptions (admin only)
func GetSubscriptionCount(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), SubscriptionTimeout)
	defer cancel()

	count, err := database.SubscriptionCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to count subscriptions"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Subscription count fetched",
		gin.H{"count": count},
	))
}
