package models

import (
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Blog struct {
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

type BlogRequest struct {
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Published bool   `json:"published"`
}

type BlogResponse struct {
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

func (b *Blog) ToResponse() BlogResponse {
	return BlogResponse{
		ID:          b.ID.Hex(),
		Title:       b.Title,
		Slug:        b.Slug,
		CoverImage:  b.CoverImage,
		Content:     b.Content,
		Author:      b.Author,
		Published:   b.Published,
		PublishedAt: b.PublishedAt,
		CreatedAt:   b.CreatedAt,
		UpdatedAt:   b.UpdatedAt,
	}
}

func GenerateBlogSlug(title string) string {
	return strings.ToLower(strings.ReplaceAll(title, " ", "-"))
}
