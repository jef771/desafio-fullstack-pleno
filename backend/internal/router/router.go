package router

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/config"
	"github.com/jef771/desafio-backend-pleno/internal/handlers"
	"github.com/jef771/desafio-backend-pleno/internal/middleware"
)

func AddRoutes(h *handlers.Handler, s *internal.Secrets) *gin.Engine {
	r := gin.Default()

	r.GET("/ping", h.Ping)

	if os.Getenv("DEV") == "true" {
		config.SetupDevLogin(r, s)
	}

	auth := r.Group("/")

	auth.Use(
		middleware.Auth(s.JWTSecret),
	)

	auth.GET(
		"/children",
		h.List,
	)

	auth.GET(
		"/children/:id",
		h.Get,
	)

	return r
}
