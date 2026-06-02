package services

import (
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
		filter.Size = 20
	}

	total, err := s.repo.Count(filter)

	if err != nil {
		return models.ListChildrenResponse{}, err
	}

	children, err := s.repo.List(filter)

	if err != nil {
		return models.ListChildrenResponse{}, err
	}

	response := models.ListChildrenResponse{
		Data:  []models.Child{},
		Page:  filter.Page,
		Size:  filter.Size,
		Total: total,
	}

	for _, child := range children {
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
