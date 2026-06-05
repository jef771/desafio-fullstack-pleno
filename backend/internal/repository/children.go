package repository

import (
	"database/sql"
	"fmt"

	"github.com/jef771/desafio-backend-pleno/internal/models"
)

type ChildrenRepository interface {
	Get(ID string) (models.Child, error)
	List(filter models.Filter) ([]models.Child, error)
	Count(filter models.Filter) (int, error)
	Review(ID string, username string) (string, error)
	Summary() (models.Summary, error)
}

type childrenRepository struct {
	DB *sql.DB
}

func NewChildrenRepository(DB *sql.DB) ChildrenRepository {
	return &childrenRepository{
		DB: DB,
	}
}

func (r *childrenRepository) Get(ID string) (models.Child, error) {
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
    				revisado_em,
    				(
						jsonb_array_length(
							COALESCE(saude->'alertas', '[]'::jsonb)
						)
						+
						jsonb_array_length(
							COALESCE(educacao->'alertas', '[]'::jsonb)
						)
						+
						jsonb_array_length(
							COALESCE(
								assistencia_social->'alertas',
								'[]'::jsonb
							)
						)
					) AS total_alertas
				FROM children
				WHERE id = $1;
	`

	var child models.Child
	err := r.DB.QueryRow(stmt, ID).Scan(
		&child.ID,
		&child.Nome,
		&child.DataNascimento,
		&child.Bairro,
		&child.Responsavel,
		&child.Saude,
		&child.Educacao,
		&child.AssistenciaSocial,
		&child.Revisado,
		&child.RevisadoPor,
		&child.RevisadoEm,
		&child.TotalAlertas)

	if err != nil {
		return models.Child{}, err
	}

	return child, nil
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
    				revisado_em,
					(
						jsonb_array_length(
							COALESCE(saude->'alertas', '[]'::jsonb)
						)
						+
						jsonb_array_length(
							COALESCE(educacao->'alertas', '[]'::jsonb)
						)
						+
						jsonb_array_length(
							COALESCE(
								assistencia_social->'alertas',
								'[]'::jsonb
							)
						)
					) AS total_alertas
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
    					(saude = 'null'::jsonb OR jsonb_array_length(saude->'alertas') = 0)
    					AND (educacao = 'null'::jsonb OR jsonb_array_length(educacao->'alertas') = 0)
    					AND (assistencia_social = 'null'::jsonb OR jsonb_array_length(assistencia_social->'alertas') = 0
		)`
	}

	if filter.OrderBy != nil && *filter.OrderBy != "" {
		order := *filter.OrderBy
		switch order {
		case "total_alertas":
			stmt += " ORDER BY total_alertas DESC "
		case "nome":
			stmt += " ORDER BY nome "
		}
	}

	stmt += fmt.Sprintf(`
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
			&n.RevisadoEm,
			&n.TotalAlertas)
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

func (r *childrenRepository) Review(id string, username string) (string, error) {
	var returnedID string

	err := r.DB.QueryRow(
		`UPDATE children
		 SET revisado = true,
		     revisado_por = $1,
		     revisado_em = NOW()
		 WHERE id = $2
		 RETURNING id`,
		username,
		id,
	).Scan(&returnedID)

	if err != nil {
		return returnedID, err
	}

	return returnedID, err
}

func (r *childrenRepository) Summary() (models.Summary, error) {
	stmt := `
		SELECT
			COUNT(*) AS total_children,

			COUNT(*) FILTER (
				WHERE revisado = true
			) AS reviewed_children,

			COUNT(*) FILTER (
				WHERE saude IS NOT NULL
					AND jsonb_array_length(saude->'alertas') > 0
			) AS health_alerts,

			COUNT(*) FILTER (
				WHERE educacao IS NOT NULL
					AND jsonb_array_length(educacao->'alertas') > 0
			) AS education_alerts,

			COUNT(*) FILTER (
				WHERE assistencia_social IS NOT NULL
					AND jsonb_array_length(assistencia_social->'alertas') > 0
			) AS social_assistance_alerts

		FROM children;
	`

	var (
		totalChildren          int
		alreadyReviewed        int
		healthAlerts           int
		educationAlerts        int
		socialAssistanceAlerts int
	)

	err := r.DB.QueryRow(stmt).Scan(
		&totalChildren,
		&alreadyReviewed,
		&healthAlerts,
		&educationAlerts,
		&socialAssistanceAlerts,
	)

	if err != nil {
		return models.Summary{}, err
	}

	return models.Summary{
		TotalOfChildren: totalChildren,
		AlreadyReviewed: alreadyReviewed,
		AlertsByDomain: []models.AlertByDomain{
			{
				Name:  "saude",
				Total: healthAlerts,
			},
			{
				Name:  "educacao",
				Total: educationAlerts,
			},
			{
				Name:  "assistencia_social",
				Total: socialAssistanceAlerts,
			},
		},
	}, nil
}
