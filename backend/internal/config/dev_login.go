package config

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jef771/desafio-backend-pleno/internal"
)

// SetupDevLogin for dev profile only
func SetupDevLogin(r *gin.Engine, secrets *internal.Secrets) {
	r.POST("/login", func(c *gin.Context) {

		var req struct {
			Email string `json:"email"`
		}

		if err := c.ShouldBindJSON(&req); err != nil || req.Email == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid body",
			})
			return
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"preferred_username": req.Email,
			"exp":                time.Now().Add(24 * time.Hour).Unix(),
		})

		tokenString, err := token.SignedString([]byte(secrets.JWTSecret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to sign token",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": tokenString,
		})
	})
}
