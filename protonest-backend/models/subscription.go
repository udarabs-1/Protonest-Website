package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Subscription struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name          string             `bson:"name" json:"name" binding:"required"`
	Email         string             `bson:"email" json:"email" binding:"required,email"`
	CareerUpdates bool               `bson:"career_updates" json:"career_updates"`
	CreatedAt     string             `bson:"created_at" json:"created_at"`
}

type SubscriptionRequest struct {
	Name          string `json:"name" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	CareerUpdates bool   `json:"career_updates"`
}

type SubscriptionResponse struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	CareerUpdates bool   `json:"career_updates"`
	CreatedAt     string `json:"created_at"`
}

func (s *Subscription) ToResponse() SubscriptionResponse {
	return SubscriptionResponse{
		ID:            s.ID.Hex(),
		Name:          s.Name,
		Email:         s.Email,
		CareerUpdates: s.CareerUpdates,
		CreatedAt:     s.CreatedAt,
	}
}
