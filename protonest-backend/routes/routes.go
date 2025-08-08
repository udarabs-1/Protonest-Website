package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shafeekms10/protonest-backend/controllers"
	"github.com/shafeekms10/protonest-backend/middleware"
)

func SetupRoutes(router *gin.Engine) {
	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "success",
			"message": "Server is running",
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		setupAuthRoutes(v1)
		setupPublicRoutes(v1)
		setupTokenValidationRoute(v1)
	}
}

func setupAuthRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		auth.POST("/signup", controllers.SignUp)
		auth.POST("/login", controllers.Login)
		auth.POST("/admin/login", controllers.AdminLogin)

		user := auth.Group("/user")
		user.Use(middleware.AuthMiddleware())
		{
			// CV routes
			user.POST("/uploadcv", controllers.UploadCV)
		}

		admin := auth.Group("/admin")
		admin.Use(middleware.AdminAuthMiddleware())
		{
			admin.GET("/subscriptions", controllers.GetSubscriptions)
			admin.GET("/subscriptions/count", controllers.GetSubscriptionCount)
			admin.GET("/contacts", controllers.GetContacts)
			admin.POST("/blogs", controllers.CreateBlog)
			admin.PUT("/blogs/:id", controllers.UpdateBlog)
			admin.DELETE("/blogs/:id", controllers.DeleteBlog)
			admin.POST("/research", controllers.CreateResearch)
			admin.PUT("/research/:id", controllers.UpdateResearch)
			admin.DELETE("/research/:id", controllers.DeleteResearch)
			admin.POST("/jobs", controllers.CreateJob)
			admin.PUT("/jobs/:id", controllers.UpdateJob)
			admin.DELETE("/jobs/:id", controllers.DeleteJob)
			admin.POST("/jobs/:id/publish", controllers.PublishJob)
		}
	}
}

func setupPublicRoutes(rg *gin.RouterGroup) {
	public := rg.Group("/public")
	{
		public.POST("/subscribe", controllers.Subscribe)
		public.POST("/contact", controllers.ContactUs)
		public.GET("/blogs", controllers.ListBlogs)
		public.GET("/blogs/:slug", controllers.GetBlog)
		public.GET("/research", controllers.ListResearch)
		public.GET("/research/:slug", controllers.GetResearch)
		public.GET("/jobs", controllers.ListJobs)
		public.GET("/jobs/:id", controllers.GetJob)
	}
}

func setupTokenValidationRoute(rg *gin.RouterGroup) {
	rg.GET("/auth/validate", controllers.ValidateToken)
}
