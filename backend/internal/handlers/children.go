package handlers

import (
	"database/sql"
	"errors"
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid query parameters",
		})
		return
	}

	response, err := h.Api.ListChildren(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal error",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing child id",
		})
		return
	}

	response, err := h.Api.GetChild(id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "child not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal error",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) Review(c *gin.Context) {
	id := c.Param("id")
	username := c.MustGet("preferred_username").(string)

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing child id",
		})
		return
	}

	updatedID, err := h.Api.ReviewChild(id, username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal error",
		})
		return
	}

	if updatedID == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "child not found",
		})
	}

	c.Status(http.StatusNoContent)
}
