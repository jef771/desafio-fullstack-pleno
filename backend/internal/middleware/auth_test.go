package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jef771/desafio-backend-pleno/internal/middleware"
	"github.com/stretchr/testify/assert"
)

const secret = "test-secret"

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	r := gin.New()

	r.Use(middleware.Auth(secret))

	r.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"username": c.GetString(
				"preferred_username",
			),
		})
	})

	return r
}

func TestAuth_MissingToken(
	t *testing.T,
) {
	r := setupRouter()

	req := httptest.NewRequest(
		http.MethodGet,
		"/protected",
		nil,
	)

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(
		t,
		http.StatusUnauthorized,
		w.Code,
	)
}

func TestAuth_InvalidToken(
	t *testing.T,
) {
	r := setupRouter()

	req := httptest.NewRequest(
		http.MethodGet,
		"/protected",
		nil,
	)

	req.Header.Set(
		"Authorization",
		"Bearer invalid-token",
	)

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(
		t,
		http.StatusUnauthorized,
		w.Code,
	)
}

func TestAuth_WrongSecret(
	t *testing.T,
) {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"preferred_username": "admin@test.com",
		},
	)

	tokenString, _ := token.SignedString(
		[]byte("another-secret"),
	)

	r := setupRouter()

	req := httptest.NewRequest(
		http.MethodGet,
		"/protected",
		nil,
	)

	req.Header.Set(
		"Authorization",
		"Bearer "+tokenString,
	)

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(
		t,
		http.StatusUnauthorized,
		w.Code,
	)
}

func TestAuth_MissingPreferredUsername(
	t *testing.T,
) {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{},
	)

	tokenString, _ := token.SignedString(
		[]byte(secret),
	)

	r := setupRouter()

	req := httptest.NewRequest(
		http.MethodGet,
		"/protected",
		nil,
	)

	req.Header.Set(
		"Authorization",
		"Bearer "+tokenString,
	)

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(
		t,
		http.StatusUnauthorized,
		w.Code,
	)
}

func TestAuth_ValidToken(
	t *testing.T,
) {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"preferred_username": "tecnico@prefeitura.rio",
		},
	)

	tokenString, _ := token.SignedString(
		[]byte(secret),
	)

	r := setupRouter()

	req := httptest.NewRequest(
		http.MethodGet,
		"/protected",
		nil,
	)

	req.Header.Set(
		"Authorization",
		"Bearer "+tokenString,
	)

	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(
		t,
		http.StatusOK,
		w.Code,
	)
}
