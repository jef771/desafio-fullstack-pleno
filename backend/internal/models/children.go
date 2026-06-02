package models

import (
	"encoding/json"
	"time"
)

type Child struct {
	ID             string
	Nome           string
	DataNascimento string `json:"data_nascimento"`
	Bairro         string
	Responsavel    string

	Saude             json.RawMessage
	Educacao          json.RawMessage
	AssistenciaSocial json.RawMessage `json:"assistencia_social"`

	Revisado    bool
	RevisadoPor *string    `json:"revisado_por"`
	RevisadoEm  *time.Time `json:"revisado_em"`
}

type ListChildrenResponse struct {
	Data  []Child `json:"data"`
	Page  int     `json:"page"`
	Size  int     `json:"size"`
	Total int     `json:"total"`
}

type Filter struct {
	Bairro    *string `form:"bairro"`
	HasAlerts *bool   `form:"has_alerts"`
	Revisado  *bool   `form:"revisado"`

	Page int `form:"page"`
	Size int `form:"page_size"`
}

type Summary struct {
	TotalOfChildren int             `json:"total_of_children"`
	AlertsByDomain  []AlertByDomain `json:"alerts_by_domain"`
	AlreadyReviewed int             `json:"already_reviewed"`
}

type AlertByDomain struct {
	Name  string `json:"domain_name"`
	Total int    `json:"total"`
}
