package router

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/handlers"
	"github.com/stretchr/testify/assert"
)

func TestProtectedRoutesRequireAuth(
	t *testing.T,
) {
	gin.SetMode(gin.TestMode)

	h := &handlers.Handler{}
	s := &internal.Secrets{
		JWTSecret: "secret",
	}

	r := AddRoutes(h, s)

	routes := []struct {
		method string
		path   string
	}{
		{"GET", "/children"},
		{"GET", "/children/123"},
		{"PATCH", "/children/123/review"},
		{"GET", "/summary"},
	}

	for _, route := range routes {
		t.Run(
			route.method+" "+route.path,
			func(t *testing.T) {

				req := httptest.NewRequest(
					route.method,
					route.path,
					nil,
				)

				w := httptest.NewRecorder()

				r.ServeHTTP(w, req)

				assert.Equal(
					t,
					http.StatusUnauthorized,
					w.Code,
				)
			},
		)
	}
}

func TestPublicRoutesDoNotRequireAuth(
	t *testing.T,
) {
	gin.SetMode(gin.TestMode)

	h := &handlers.Handler{}
	s := &internal.Secrets{
		JWTSecret: "secret",
	}

	r := AddRoutes(h, s)

	routes := []struct {
		method string
		path   string
	}{
		{"GET", "/ping"},
		{"POST", "/auth/token"},
	}

	for _, route := range routes {
		t.Run(
			route.method+" "+route.path,
			func(t *testing.T) {

				req := httptest.NewRequest(
					route.method,
					route.path,
					nil,
				)

				w := httptest.NewRecorder()

				r.ServeHTTP(w, req)

				assert.NotEqual(
					t,
					http.StatusUnauthorized,
					w.Code,
				)
			},
		)
	}
}
