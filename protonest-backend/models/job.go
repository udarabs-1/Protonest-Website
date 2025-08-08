package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobType string
type PaymentType string
type JobStatus string

const (
	FullTime  JobType = "full-time"
	PartTime  JobType = "part-time"
	Contract  JobType = "contract"
	Temporary JobType = "temporary"

	Fixed      PaymentType = "fixed"
	Hourly     PaymentType = "hourly"
	Project    PaymentType = "project"
	Negotiable PaymentType = "negotiable"

	Draft     JobStatus = "draft"
	Published JobStatus = "published"
	Scheduled JobStatus = "scheduled"
)

type Job struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title            string             `bson:"title" json:"title" binding:"required"`
	Category         string             `bson:"category" json:"category" binding:"required"`
	JobType          JobType            `bson:"job_type" json:"job_type" binding:"required"`
	PaymentType      PaymentType        `bson:"payment_type" json:"payment_type" binding:"required"`
	Payment          float64            `bson:"payment" json:"payment" binding:"required"`
	Location         string             `bson:"location" json:"location" binding:"required"`
	ExpectedDuration string             `bson:"expected_duration" json:"expected_duration" binding:"required"`
	Description      string             `bson:"description" json:"description" binding:"required"`
	RequiredSkills   []string           `bson:"required_skills" json:"required_skills" binding:"required"`
	ScheduleAt       *time.Time         `bson:"schedule_at,omitempty" json:"schedule_at,omitempty"`
	Status           JobStatus          `bson:"status" json:"status"`
	CreatedBy        string             `bson:"created_by" json:"created_by"`
	CreatedAt        time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt        time.Time          `bson:"updated_at" json:"updated_at"`
}

type JobRequest struct {
	Title            string      `json:"title" binding:"required"`
	Category         string      `json:"category" binding:"required"`
	JobType          JobType     `json:"job_type" binding:"required"`
	PaymentType      PaymentType `json:"payment_type" binding:"required"`
	Payment          float64     `json:"payment" binding:"required"`
	Location         string      `json:"location" binding:"required"`
	ExpectedDuration string      `json:"expected_duration" binding:"required"`
	Description      string      `json:"description" binding:"required"`
	RequiredSkills   []string    `json:"required_skills" binding:"required"`
	ScheduleAt       *time.Time  `json:"schedule_at,omitempty"`
	PublishNow       bool        `json:"publish_now"`
}

type JobResponse struct {
	ID               string      `json:"id"`
	Title            string      `json:"title"`
	Category         string      `json:"category"`
	JobType          JobType     `json:"job_type"`
	PaymentType      PaymentType `json:"payment_type"`
	Payment          float64     `json:"payment"`
	Location         string      `json:"location"`
	ExpectedDuration string      `json:"expected_duration"`
	Description      string      `json:"description"`
	RequiredSkills   []string    `json:"required_skills"`
	ScheduleAt       *time.Time  `json:"schedule_at,omitempty"`
	Status           JobStatus   `json:"status"`
	CreatedBy        string      `json:"created_by"`
	CreatedAt        time.Time   `json:"created_at"`
	UpdatedAt        time.Time   `json:"updated_at"`
}

func (j *Job) ToResponse() JobResponse {
	return JobResponse{
		ID:               j.ID.Hex(),
		Title:            j.Title,
		Category:         j.Category,
		JobType:          j.JobType,
		PaymentType:      j.PaymentType,
		Payment:          j.Payment,
		Location:         j.Location,
		ExpectedDuration: j.ExpectedDuration,
		Description:      j.Description,
		RequiredSkills:   j.RequiredSkills,
		ScheduleAt:       j.ScheduleAt,
		Status:           j.Status,
		CreatedBy:        j.CreatedBy,
		CreatedAt:        j.CreatedAt,
		UpdatedAt:        j.UpdatedAt,
	}
}
