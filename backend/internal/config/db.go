package config

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Env struct {
	DB *sql.DB
}

func NewDB(dataSourceName string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}
