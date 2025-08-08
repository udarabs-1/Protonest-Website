package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Contact struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name      string             `bson:"name" json:"name" binding:"required"`
	Email     string             `bson:"email" json:"email" binding:"required,email"`
	Message   string             `bson:"message" json:"message" binding:"required"`
	CreatedAt string             `bson:"created_at" json:"created_at"`
}

type ContactRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}

type ContactResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
}

func (c *Contact) ToResponse() ContactResponse {
	return ContactResponse{
		ID:        c.ID.Hex(),
		Name:      c.Name,
		Email:     c.Email,
		Message:   c.Message,
		CreatedAt: c.CreatedAt,
	}
}
