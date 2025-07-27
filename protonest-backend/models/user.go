// models/user.go
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirstName string             `bson:"first_name" json:"first_name" binding:"required"`
	LastName  string             `bson:"last_name" json:"last_name" binding:"required"`
	Email     string             `bson:"email" json:"email" binding:"required,email"`
	Password  string             `bson:"password" json:"password,omitempty" binding:"required,min=6"`
	Country   string             `bson:"country" json:"country" binding:"required"`
	CreatedAt string             `bson:"created_at" json:"created_at"`
}

// UserResponse represents user data for API responses (without password)
type UserResponse struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Country   string `json:"country"`
	CreatedAt string `json:"created_at"`
}

// ToResponse converts User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:        u.ID.Hex(),
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Country:   u.Country,
		CreatedAt: u.CreatedAt,
	}
}

// LoginRequest represents login request payload
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse represents login response data
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}
