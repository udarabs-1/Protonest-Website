package models

import (
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Research struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title       string             `bson:"title" json:"title" binding:"required"`
	Slug        string             `bson:"slug" json:"slug"`
	CoverImage  string             `bson:"cover_image" json:"cover_image"`
	Content     string             `bson:"content" json:"content" binding:"required"`
	Author      string             `bson:"author" json:"author"`
	Published   bool               `bson:"published" json:"published"`
	PublishedAt string             `bson:"published_at" json:"published_at,omitempty"`
	CreatedAt   string             `bson:"created_at" json:"created_at"`
	UpdatedAt   string             `bson:"updated_at" json:"updated_at"`
}

type ResearchRequest struct {
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Published bool   `json:"published"`
}

type ResearchResponse struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	CoverImage  string `json:"cover_image"`
	Content     string `json:"content"`
	Author      string `json:"author"`
	Published   bool   `json:"published"`
	PublishedAt string `json:"published_at,omitempty"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

func (r *Research) ToResponse() ResearchResponse {
	return ResearchResponse{
		ID:          r.ID.Hex(),
		Title:       r.Title,
		Slug:        r.Slug,
		CoverImage:  r.CoverImage,
		Content:     r.Content,
		Author:      r.Author,
		Published:   r.Published,
		PublishedAt: r.PublishedAt,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

func GenerateResearchSlug(title string) string {
	return strings.ToLower(strings.ReplaceAll(title, " ", "-"))
}
