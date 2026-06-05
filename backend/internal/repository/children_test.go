package repository

import (
	"database/sql"
	"encoding/json"
	"os"
	"testing"

	"github.com/jef771/desafio-backend-pleno/internal/config"
	"github.com/jef771/desafio-backend-pleno/internal/models"
	_ "github.com/lib/pq"
)

func setupTestDB(t *testing.T) *sql.DB {
	t.Helper()

	db, err := sql.Open("postgres",
		os.Getenv("DATABASE_TEST_URL"))
	if err != nil {
		t.Fatalf("failed to connect db: %v", err)
	}

	if err := db.Ping(); err != nil {
		t.Fatalf("failed to ping db: %v", err)
	}

	if err := config.RunMigrations(db); err != nil {
		t.Fatalf("failed to run migrations for tests: %v", err)
	}

	cleanupTables(t, db)
	seedTestData(t, db)

	return db
}

func cleanupTables(t *testing.T, db *sql.DB) {
	t.Helper()

	_, err := db.Exec(`
		TRUNCATE TABLE children RESTART IDENTITY CASCADE;
	`)
	if err != nil {
		t.Fatalf("failed cleaning database: %v", err)
	}
}

func seedTestData(t *testing.T, db *sql.DB) {
	t.Helper()

	content, err := os.ReadFile("../config/data/seed_test.json")
	if err != nil {
		t.Fatalf("failed to read seed file: %v", err)
	}

	var children []models.Child
	if err := json.Unmarshal(content, &children); err != nil {
		t.Fatalf("failed to unmarshal seed data: %v", err)
	}

	for _, child := range children {
		_, err := db.Exec(`
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
				revisado_por
			)
			VALUES (
				$1,$2,$3,$4,$5,
				$6,$7,$8,$9,$10
			)
		`,
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
		)

		if err != nil {
			t.Fatalf("failed inserting seed data: %v", err)
		}
	}
}

func TestChildrenRepository_Get_Success(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	var id string
	err := db.QueryRow(`SELECT id FROM children LIMIT 1`).Scan(&id)
	if err != nil {
		t.Fatalf("failed to fetch seed id: %v", err)
	}

	child, err := repo.Get(id)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if child.ID != id {
		t.Errorf("expected %s, got %s", id, child.ID)
	}

	if child.TotalAlertas < 0 {
		t.Errorf("expected TotalAlertas >= 0, got %d", child.TotalAlertas)
	}
}

func TestChildrenRepository_List_BasicPagination(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	filter := models.Filter{
		Page: 1,
		Size: 10,
	}

	res, err := repo.List(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(res) == 0 {
		t.Fatalf("expected results, got empty")
	}
}

func TestChildrenRepository_List_FilterByBairro(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	var bairro string
	err := db.QueryRow(`SELECT bairro FROM children LIMIT 1`).Scan(&bairro)
	if err != nil {
		t.Fatalf("failed seed query: %v", err)
	}

	filter := models.Filter{
		Page:   1,
		Size:   10,
		Bairro: ptrStr(bairro),
	}

	res, err := repo.List(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for _, c := range res {
		if c.Bairro != bairro {
			t.Errorf("expected bairro %s, got %s", bairro, c.Bairro)
		}
	}
}

func TestChildrenRepository_List_FilterRevisadoTrue(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	filter := models.Filter{
		Page:     1,
		Size:     10,
		Revisado: ptrBool(true),
	}

	res, err := repo.List(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for _, c := range res {
		if !c.Revisado {
			t.Errorf("expected revisado=true, got false")
		}
	}
}

func TestChildrenRepository_List_HasAlerts(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	filter := models.Filter{
		Page:      1,
		Size:      20,
		HasAlerts: ptrBool(true),
	}

	res, err := repo.List(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(res) == 0 {
		t.Fatalf("expected at least one result")
	}

	for _, c := range res {
		if c.TotalAlertas == 0 {
			t.Errorf("expected alerts > 0")
		}
	}
}

func TestChildrenRepository_Count_Basic(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	filter := models.Filter{
		Page: 1,
		Size: 10,
	}

	count, err := repo.Count(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if count <= 0 {
		t.Errorf("expected count > 0, got %d", count)
	}
}

func TestChildrenRepository_Count_ByBairro(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	var bairro string
	_ = db.QueryRow(`SELECT bairro FROM children LIMIT 1`).Scan(&bairro)

	filter := models.Filter{
		Page:   1,
		Size:   10,
		Bairro: ptrStr(bairro),
	}

	count, err := repo.Count(filter)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if count < 0 {
		t.Errorf("invalid count")
	}
}

func TestChildrenRepository_Review_Success(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	var id string
	err := db.QueryRow(`SELECT id FROM children WHERE revisado = false LIMIT 1`).Scan(&id)
	if err != nil {
		t.Fatalf("no unrevised seed data available: %v", err)
	}

	returnedID, err := repo.Review(id, "unit-test-user")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if returnedID != id {
		t.Errorf("expected %s, got %s", id, returnedID)
	}

	var revisado bool
	var revisadoPor string

	_ = db.QueryRow(`SELECT revisado, revisado_por FROM children WHERE id=$1`, id).
		Scan(&revisado, &revisadoPor)

	if !revisado {
		t.Errorf("expected revisado=true")
	}

	if revisadoPor != "unit-test-user" {
		t.Errorf("expected reviewer to be updated")
	}
}

func TestChildrenRepository_Summary(t *testing.T) {
	db := setupTestDB(t)
	repo := NewChildrenRepository(db)

	summary, err := repo.Summary()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if summary.TotalOfChildren <= 0 {
		t.Errorf("expected total children > 0")
	}

	if len(summary.AlertsByDomain) != 3 {
		t.Errorf("expected 3 domains, got %d", len(summary.AlertsByDomain))
	}

	expected := map[string]bool{
		"saude":              false,
		"educacao":           false,
		"assistencia_social": false,
	}

	for _, a := range summary.AlertsByDomain {
		if _, ok := expected[a.Name]; !ok {
			t.Errorf("unexpected domain %s", a.Name)
		}
		expected[a.Name] = true
	}
}

func ptrBool(v bool) *bool    { return &v }
func ptrStr(v string) *string { return &v }
