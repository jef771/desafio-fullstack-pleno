package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/models"
	"github.com/jef771/desafio-backend-pleno/internal/services"
)

type Handler struct {
	Api services.ApiService
}

func NewHandler(
	secrets *internal.Secrets,
	api services.ApiService,
) *Handler {
	return &Handler{
		Api: api}
}

func (h *Handler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func (h *Handler) List(c *gin.Context) {
	var filter models.Filter

	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid query parameters",
		})
		return
	}

	response, err := h.Api.ListChildren(filter)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "internal error",
		})
		return
	}

	c.JSON(200, response)
}
