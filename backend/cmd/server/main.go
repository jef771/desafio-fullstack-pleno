package main

import (
	"log"
	"os"

	"github.com/jef771/desafio-backend-pleno/internal"
	"github.com/jef771/desafio-backend-pleno/internal/config"
	"github.com/jef771/desafio-backend-pleno/internal/handlers"
	"github.com/jef771/desafio-backend-pleno/internal/repository"
	"github.com/jef771/desafio-backend-pleno/internal/router"
	"github.com/jef771/desafio-backend-pleno/internal/services"
	_ "github.com/lib/pq"
)

func main() {
	db, err := config.NewDB(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = config.RunMigrations(db)
	if err != nil {
		log.Fatal(err)
	}

	secrets := &internal.Secrets{
		JWTSecret: os.Getenv("JWT_SECRET"),
		Credentials: internal.Credentials{
			Username: os.Getenv("USERNAME"),
			Password: os.Getenv("PASSWORD"),
		},
	}

	repo := repository.NewChildrenRepository(db)
	apiService := services.NewApiService(repo)
	handler := handlers.NewHandler(apiService, secrets)
	engine := router.AddRoutes(handler, secrets)

	if err := engine.Run(":8080"); err != nil {
		log.Fatalf("Server initialization error: %v", err)
	}
}
