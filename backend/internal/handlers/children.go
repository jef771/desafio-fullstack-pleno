package handlers

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/models"
	"github.com/jef771/desafio-backend-pleno/internal/services"
)

type Handler struct {
	Api     services.ApiService
	Secrets *internal.Secrets
}

func NewHandler(
	api services.ApiService,
	secrets *internal.Secrets,
) *Handler {
	return &Handler{
		Api:     api,
		Secrets: secrets,
	}
}

func (h *Handler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid body",
		})
		return
	}

	if req.Email != h.Secrets.Credentials.Username ||
		req.Password != h.Secrets.Credentials.Password {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid credentials",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"preferred_username": req.Email,
		"exp":                time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.Secrets.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to sign token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
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

func (h *Handler) Summary(c *gin.Context) {
	response, err := h.Api.GetSummary()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal error",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}
