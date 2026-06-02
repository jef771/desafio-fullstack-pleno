package repository

import (
	"database/sql"
	"fmt"

	"github.com/jef771/desafio-backend-pleno/internal/models"
)

type ChildrenRepository interface {
	List(filter models.Filter) ([]models.Child, error)
	Count(filter models.Filter) (int, error)
	MarkAsRevisado(id int) error
}

type childrenRepository struct {
	DB *sql.DB
}

func NewChildrenRepository(DB *sql.DB) ChildrenRepository {
	return &childrenRepository{
		DB: DB,
	}
}

func (r *childrenRepository) List(filter models.Filter) ([]models.Child, error) {
	args := make([]any, 0)

	stmt := `
				SELECT
    				id,
    				nome,
	    			data_nascimento,
    				bairro,
    				responsavel,
    				saude,
    				educacao,
    				assistencia_social,
    				revisado,
    				revisado_por,
    				revisado_em
				FROM children
				WHERE 1 = 1
	`

	if filter.Bairro != nil && *filter.Bairro != "" {
		stmt += fmt.Sprintf(" AND bairro = $%d", len(args)+1)
		args = append(args, *filter.Bairro)
	}

	if filter.Revisado != nil && *filter.Revisado {
		stmt += " AND revisado IS true"
	}

	if filter.Revisado != nil && !*filter.Revisado {
		stmt += " AND revisado IS false"
	}

	if filter.HasAlerts != nil && *filter.HasAlerts {
		stmt += ` AND (
						jsonb_array_length(saude->'alertas') > 0
						OR jsonb_array_length(educacao->'alertas') > 0
						OR jsonb_array_length(assistencia_social->'alertas') > 0
		)`
	}

	if filter.HasAlerts != nil && !*filter.HasAlerts {
		stmt += ` AND (
    					jsonb_array_length(saude->'alertas') = 0
    					AND jsonb_array_length(educacao->'alertas') = 0
    					AND jsonb_array_length(assistencia_social->'alertas') = 0
		)`
	}

	stmt += fmt.Sprintf(`
				ORDER BY nome
				LIMIT $%d
				OFFSET $%d`,
		len(args)+1,
		len(args)+2,
	)

	args = append(args, filter.Size)
	args = append(args, (filter.Page-1)*filter.Size)

	rows, err := r.DB.Query(stmt, args...)

	if err != nil {
		return []models.Child{}, err
	}

	defer rows.Close()

	var notifications []models.Child

	for rows.Next() {
		var n models.Child
		err = rows.Scan(
			&n.ID,
			&n.Nome,
			&n.DataNascimento,
			&n.Bairro,
			&n.Responsavel,
			&n.Saude,
			&n.Educacao,
			&n.AssistenciaSocial,
			&n.Revisado,
			&n.RevisadoPor,
			&n.RevisadoEm)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}

	return notifications, nil
}

func (r *childrenRepository) Count(filter models.Filter) (int, error) {
	args := make([]any, 0)

	stmt := `	SELECT
					COUNT(*)
				FROM children
				WHERE 1=1
	`

	if filter.Bairro != nil && *filter.Bairro != "" {
		stmt += fmt.Sprintf(" AND bairro = $%d", len(args)+1)
		args = append(args, *filter.Bairro)
	}

	if filter.Revisado != nil && *filter.Revisado {
		stmt += " AND revisado IS true"
	}

	if filter.Revisado != nil && !*filter.Revisado {
		stmt += " AND revisado IS false"
	}

	if filter.HasAlerts != nil && *filter.HasAlerts {
		stmt += ` AND (
						jsonb_array_length(saude->'alertas') > 0
						OR jsonb_array_length(educacao->'alertas') > 0
						OR jsonb_array_length(assistencia_social->'alertas') > 0
		)`
	}

	if filter.HasAlerts != nil && !*filter.HasAlerts {
		stmt += ` AND (
    					jsonb_array_length(saude->'alertas') = 0
    					AND jsonb_array_length(educacao->'alertas') = 0
    					AND jsonb_array_length(assistencia_social->'alertas') = 0
		)`
	}

	var total int
	err := r.DB.QueryRow(stmt, args...).Scan(&total)

	if err != nil {
		return 0, err
	}

	return total, nil
}

func (m *childrenRepository) MarkAsRevisado(id int) error {
	stmt := `UPDATE children SET revisado = true WHERE id = $1`

	_, err := m.DB.Exec(stmt, id)
	if err != nil {
		return err
	}
	return nil
}
