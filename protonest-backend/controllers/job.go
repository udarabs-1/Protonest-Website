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
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	JobTimeout = 15 * time.Second
)

// CreateJob creates a new job posting
func CreateJob(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	adminEmail, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	var req models.JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	// Determine job status
	status := models.Draft
	if req.PublishNow {
		if req.ScheduleAt != nil {
			status = models.Scheduled
		} else {
			status = models.Published
		}
	}

	job := models.Job{
		Title:            req.Title,
		Category:         req.Category,
		JobType:          req.JobType,
		PaymentType:      req.PaymentType,
		Payment:          req.Payment,
		Location:         req.Location,
		ExpectedDuration: req.ExpectedDuration,
		Description:      req.Description,
		RequiredSkills:   req.RequiredSkills,
		ScheduleAt:       req.ScheduleAt,
		Status:           status,
		CreatedBy:        adminEmail.(string),
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	result, err := database.JobCollection.InsertOne(ctx, job)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to create job posting"))
		return
	}

	job.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, models.SuccessResponse(
		"Job posting created successfully",
		job.ToResponse(),
	))
}

// UpdateJob updates an existing job posting
func UpdateJob(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	_, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	jobID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(jobID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid job ID"))
		return
	}

	var req models.JobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	var existingJob models.Job
	err = database.JobCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingJob)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Job posting not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	// Determine job status
	status := existingJob.Status
	if req.PublishNow {
		if req.ScheduleAt != nil {
			status = models.Scheduled
		} else {
			status = models.Published
		}
	} else if existingJob.Status == models.Published || existingJob.Status == models.Scheduled {
		// Don't allow changing status back to draft if already published/scheduled
		status = existingJob.Status
	}

	update := bson.M{
		"$set": bson.M{
			"title":             req.Title,
			"category":          req.Category,
			"job_type":          req.JobType,
			"payment_type":      req.PaymentType,
			"payment":           req.Payment,
			"location":          req.Location,
			"expected_duration": req.ExpectedDuration,
			"description":       req.Description,
			"required_skills":   req.RequiredSkills,
			"schedule_at":       req.ScheduleAt,
			"status":            status,
			"updated_at":        time.Now(),
		},
	}

	_, err = database.JobCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		update,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to update job posting"))
		return
	}

	var updatedJob models.Job
	err = database.JobCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedJob)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch updated job"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Job posting updated successfully",
		updatedJob.ToResponse(),
	))
}

// GetJob retrieves a single job posting
func GetJob(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	jobID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(jobID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid job ID"))
		return
	}

	var job models.Job
	err = database.JobCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&job)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Job posting not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Job posting fetched successfully",
		job.ToResponse(),
	))
}

// ListJobs retrieves all job postings with filtering options
func ListJobs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	// Get query parameters
	status := c.Query("status")
	category := c.Query("category")
	jobType := c.Query("job_type")
	location := c.Query("location")

	filter := bson.M{}
	if status != "" {
		filter["status"] = status
	}
	if category != "" {
		filter["category"] = category
	}
	if jobType != "" {
		filter["job_type"] = jobType
	}
	if location != "" {
		filter["location"] = bson.M{"$regex": location, "$options": "i"}
	}

	// Only show published jobs to non-admins
	_, exists := c.Get("admin_email")
	if !exists {
		filter["status"] = models.Published
		// Filter out scheduled jobs that haven't been published yet
		filter["$or"] = []bson.M{
			{"schedule_at": nil},
			{"schedule_at": bson.M{"$lte": time.Now()}},
		}
	}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := database.JobCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch job postings"))
		return
	}
	defer cursor.Close(ctx)

	var jobs []models.JobResponse
	for cursor.Next(ctx) {
		var job models.Job
		if err := cursor.Decode(&job); err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to decode job posting"))
			return
		}
		jobs = append(jobs, job.ToResponse())
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Job postings fetched successfully",
		jobs,
	))
}

// DeleteJob deletes a job posting
func DeleteJob(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	_, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	jobID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(jobID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid job ID"))
		return
	}

	_, err = database.JobCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to delete job posting"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Job posting deleted successfully",
		nil,
	))
}

// PublishJob publishes a draft job or schedules it for later
func PublishJob(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), JobTimeout)
	defer cancel()

	_, exists := c.Get("admin_email")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.FailResponse("Admin authentication required"))
		return
	}

	jobID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(jobID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid job ID"))
		return
	}

	var req struct {
		PublishNow bool       `json:"publish_now"`
		ScheduleAt *time.Time `json:"schedule_at,omitempty"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.FailResponse("Invalid request data"))
		return
	}

	var existingJob models.Job
	err = database.JobCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&existingJob)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, models.FailResponse("Job posting not found"))
			return
		}
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Database error"))
		return
	}

	status := models.Draft
	if req.PublishNow {
		if req.ScheduleAt != nil {
			status = models.Scheduled
		} else {
			status = models.Published
		}
	}

	update := bson.M{
		"$set": bson.M{
			"status":      status,
			"schedule_at": req.ScheduleAt,
			"updated_at":  time.Now(),
		},
	}

	_, err = database.JobCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		update,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to update job status"))
		return
	}

	var updatedJob models.Job
	err = database.JobCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedJob)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse("Failed to fetch updated job"))
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse(
		"Job status updated successfully",
		updatedJob.ToResponse(),
	))
}
