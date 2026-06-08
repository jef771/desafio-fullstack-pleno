package services

import (
	"database/sql"
	"errors"

	"github.com/jef771/desafio-backend-pleno/internal/models"
	"github.com/jef771/desafio-backend-pleno/internal/repository"
)

type ApiService interface {
	ListChildren(
		filter models.Filter,
	) (models.ListChildrenResponse, error)

	GetChild(
		ID string,
	) (models.Child, error)

	ReviewChild(
		ID string,
		username string,
	) (string, error)

	GetSummary() (models.Summary, error)
}

type apiService struct {
	repo repository.ChildrenRepository
}

func NewApiService(repo repository.ChildrenRepository) ApiService {
	return &apiService{
		repo: repo,
	}
}

func (s *apiService) ListChildren(filter models.Filter) (models.ListChildrenResponse, error) {

	if filter.Page < 1 {
		filter.Page = 1
	}

	if filter.Size < 1 {
		filter.Size = 10
	}

	if filter.OrderBy == nil ||
		(filter.OrderBy != nil && *filter.OrderBy == "") {
		defaultOrder := "nome"
		filter.OrderBy = &defaultOrder
	}

	if filter.Direction == nil ||
		(filter.Direction != nil && *filter.Direction == "") {
		defaultDirection := "asc"
		filter.Direction = &defaultDirection
	}

	total, err := s.repo.Count(filter)

	if err != nil {
		return models.ListChildrenResponse{}, err
	}

	list, err := s.repo.List(filter)

	if err != nil {
		return models.ListChildrenResponse{}, err
	}

	response := models.ListChildrenResponse{
		Data:  []models.Child{},
		Page:  filter.Page,
		Size:  filter.Size,
		Total: total,
	}

	for _, child := range list {
		response.Data = append(response.Data, models.Child{
			ID:                child.ID,
			Nome:              child.Nome,
			DataNascimento:    child.DataNascimento,
			Bairro:            child.Bairro,
			Responsavel:       child.Responsavel,
			Saude:             child.Saude,
			Educacao:          child.Educacao,
			AssistenciaSocial: child.AssistenciaSocial,
			Revisado:          child.Revisado,
			RevisadoPor:       child.RevisadoPor,
			RevisadoEm:        child.RevisadoEm,
			TotalAlertas:      child.TotalAlertas,
		})
	}

	return response, nil
}

func (s *apiService) GetChild(ID string) (models.Child, error) {

	response, err := s.repo.Get(ID)

	if err != nil {
		return models.Child{}, err
	}

	if response.ID == "" {
		return models.Child{}, nil
	}

	return response, nil
}

func (s *apiService) ReviewChild(ID string, username string) (string, error) {

	updatedID, err := s.repo.Review(ID, username)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", nil
		}
		return "", err
	}

	return updatedID, nil
}

func (s *apiService) GetSummary() (models.Summary, error) {
	summary, err := s.repo.Summary()

	if err != nil {
		return models.Summary{}, err
	}

	return summary, nil
}
