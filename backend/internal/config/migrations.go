package config

import (
	"context"
	"database/sql"
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"

	"github.com/jef771/desafio-backend-pleno/internal/models"
)

func RunMigrations(db *sql.DB) error {
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS children (
		id TEXT PRIMARY KEY,
		nome TEXT NOT NULL,
		data_nascimento DATE NOT NULL,
		bairro TEXT NOT NULL,
		responsavel TEXT NOT NULL,
	
		saude JSONB,
		educacao JSONB,
		assistencia_social JSONB,
	
		revisado BOOLEAN NOT NULL DEFAULT FALSE,
		revisado_por TEXT,
		revisado_em TIMESTAMP
	);`)

	if err != nil {
		return err
	}

	err = SeedChildren(context.Background(), db)

	if err != nil {
		return err
	}

	return nil
}

func SeedChildren(ctx context.Context, db *sql.DB) error {
	_, filename, _, _ := runtime.Caller(0)

	dir := filepath.Dir(filename)

	path := filepath.Join(dir, "data", "seed.json")

	content, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	var children []models.Child

	if err := json.Unmarshal(content, &children); err != nil {
		return err
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		INSERT INTO children (
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
		)
		VALUES (
			$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
		)
		ON CONFLICT (id) DO NOTHING
	`)
	if err != nil {
		return err
	}

	defer stmt.Close()

	for _, child := range children {
		_, err := stmt.ExecContext(
			ctx,
			child.ID,
			child.Nome,
			child.DataNascimento,
			child.Bairro,
			child.Responsavel,
			child.Saude,
			child.Educacao,
			child.AssistenciaSocial,
			child.Revisado,
			child.RevisadoPor,
			child.RevisadoEm,
		)

		if err != nil {
			return err
		}
	}

	return tx.Commit()
}
