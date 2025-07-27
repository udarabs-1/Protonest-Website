// models/admin.go
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Admin struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirstName string             `bson:"first_name" json:"first_name"`
	LastName  string             `bson:"last_name" json:"last_name"`
	Email     string             `bson:"email" json:"email" binding:"required,email"`
	Password  string             `bson:"password" json:"password,omitempty" binding:"required,min=6"`
	Role      string             `bson:"role" json:"role"` // "super_admin" or "admin"
	CreatedAt string             `bson:"created_at" json:"created_at"`
}

type AdminResponse struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
}

func (a *Admin) ToResponse() AdminResponse {
	return AdminResponse{
		ID:        a.ID.Hex(),
		FirstName: a.FirstName,
		LastName:  a.LastName,
		Email:     a.Email,
		Role:      a.Role,
		CreatedAt: a.CreatedAt,
	}
}

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AdminLoginResponse struct {
	Token string        `json:"token"`
	Admin AdminResponse `json:"admin"`
}
