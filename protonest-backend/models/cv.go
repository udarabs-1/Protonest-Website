package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CV struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID          string             `bson:"user_id" json:"user_id"`
	FullName        string             `bson:"full_name" json:"full_name" binding:"required"`
	Email           string             `bson:"email" json:"email" binding:"required,email"`
	PhoneNumber     string             `bson:"phone_number" json:"phone_number" binding:"required"`
	Location        string             `bson:"location" json:"location" binding:"required"`
	NDAAcknowledged bool               `bson:"nda_acknowledged" json:"nda_acknowledged" binding:"required"`
	CVFileURL       string             `bson:"cv_file_url" json:"cv_file_url"`
	Expertise       []string           `bson:"expertise" json:"expertise"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updated_at"`
}

type CVRequest struct {
	FullName        string   `form:"full_name" binding:"required"`
	Email           string   `form:"email" binding:"required,email"`
	PhoneNumber     string   `form:"phone_number" binding:"required"`
	Location        string   `form:"location" binding:"required"`
	NDAAcknowledged bool     `form:"nda_acknowledged" binding:"required"`
	Expertise       []string `form:"expertise" binding:"required"`
}

type CVResponse struct {
	ID              string    `json:"id"`
	FullName        string    `json:"full_name"`
	Email           string    `json:"email"`
	PhoneNumber     string    `json:"phone_number"`
	Location        string    `json:"location"`
	NDAAcknowledged bool      `json:"nda_acknowledged"`
	CVFileURL       string    `json:"cv_file_url"`
	Expertise       []string  `json:"expertise"`
	CreatedAt       time.Time `json:"created_at"`
}

func (c *CV) ToResponse() CVResponse {
	return CVResponse{
		ID:              c.ID.Hex(),
		FullName:        c.FullName,
		Email:           c.Email,
		PhoneNumber:     c.PhoneNumber,
		Location:        c.Location,
		NDAAcknowledged: c.NDAAcknowledged,
		CVFileURL:       c.CVFileURL,
		Expertise:       c.Expertise,
		CreatedAt:       c.CreatedAt,
	}
}
