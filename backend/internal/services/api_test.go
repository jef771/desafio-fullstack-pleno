package services

import (
	"database/sql"
	"testing"

	"github.com/jef771/desafio-backend-pleno/internal/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockRepository struct {
	countFn   func(models.Filter) (int, error)
	listFn    func(models.Filter) ([]models.Child, error)
	getFn     func(string) (models.Child, error)
	reviewFn  func(string, string) (string, error)
	summaryFn func() (models.Summary, error)
}

func (m *mockRepository) Count(
	filter models.Filter,
) (int, error) {
	return m.countFn(filter)
}

func (m *mockRepository) List(
	filter models.Filter,
) ([]models.Child, error) {
	return m.listFn(filter)
}

func (m *mockRepository) Get(
	id string,
) (models.Child, error) {
	return m.getFn(id)
}

func (m *mockRepository) Review(
	id string,
	username string,
) (string, error) {
	return m.reviewFn(id, username)
}

func (m *mockRepository) Summary() (
	models.Summary,
	error,
) {
	return m.summaryFn()
}

func TestListChildren_DefaultValues(
	t *testing.T,
) {
	var received models.Filter

	repo := &mockRepository{
		countFn: func(
			filter models.Filter,
		) (int, error) {

			received = filter

			return 0, nil
		},

		listFn: func(
			filter models.Filter,
		) ([]models.Child, error) {
			return []models.Child{}, nil
		},
	}

	service := NewApiService(repo)

	_, err := service.ListChildren(
		models.Filter{},
	)

	require.NoError(t, err)

	assert.Equal(t, 1, received.Page)
	assert.Equal(t, 10, received.Size)

	require.NotNil(
		t,
		received.OrderBy,
	)

	assert.Equal(
		t,
		"nome",
		*received.OrderBy,
	)
}

func TestGetChild_NotFound(
	t *testing.T,
) {
	repo := &mockRepository{
		getFn: func(
			id string,
		) (models.Child, error) {

			return models.Child{}, nil
		},
	}

	service := NewApiService(repo)

	child, err := service.GetChild(
		"123",
	)

	require.NoError(t, err)

	assert.Empty(t, child.ID)
}

func TestReviewChild_NoRows(
	t *testing.T,
) {
	repo := &mockRepository{
		reviewFn: func(
			id string,
			username string,
		) (string, error) {

			return "",
				sql.ErrNoRows
		},
	}

	service := NewApiService(repo)

	id, err := service.ReviewChild(
		"123",
		"admin",
	)

	require.NoError(t, err)

	assert.Empty(t, id)
}
