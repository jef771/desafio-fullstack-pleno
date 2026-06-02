package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/handlers"
	"github.com/jef771/desafio-backend-pleno/internal/middleware"
)

func AddRoutes(h *handlers.Handler, s *internal.Secrets) *gin.Engine {
	r := gin.Default()

	r.GET(
		"/ping",
		h.Ping,
	)

	r.POST(
		"/auth/token",
		h.Login,
	)

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

	auth.PATCH(
		"/children/:id/review",
		h.Review,
	)

	auth.GET(
		"/summary",
		h.Summary,
	)

	return r
}
