# Documentação da API

## URL Base

```text
http://localhost:8080
```

---

## Autenticação

Os endpoints protegidos exigem um token JWT no cabeçalho `Authorization`.

```http
Authorization: Bearer <token>
```

Obtenha o token através do endpoint de autenticação.

---

## Health Check

### GET /ping

Verifica se a API está em execução.

#### Resposta

**200 OK**

```json
{
  "message": "pong"
}
```

---

## Autenticação

### POST /auth/token

Autentica um usuário e retorna um token JWT.

#### Requisição

```json
{
  "email": "admin@example.com",
  "password": "secret"
}
```

#### Respostas

**200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**400 Bad Request**

```json
{
  "error": "invalid body"
}
```

**401 Unauthorized**

```json
{
  "error": "invalid credentials"
}
```

---

## Crianças

### GET /children

Retorna uma lista paginada de crianças.

#### Parâmetros de Consulta (Query Params)

| Parâmetro  | Tipo    | Descrição                              |
| ---------- | ------- | -------------------------------------- |
| bairro     | string  | Filtra por bairro                      |
| has_alerts | boolean | Retorna apenas crianças com alertas    |
| revisado   | boolean | Filtra pelo status de revisão          |
| order      | string  | Campo utilizado para ordenação         |
| direction  | string  | Direção da ordenação (`asc` ou `desc`) |
| page       | integer | Número da página                       |
| size       | integer | Quantidade de registros por página     |

#### Exemplo

```http
GET /children?page=1&size=10&bairro=Centro&has_alerts=true
```

#### Resposta

**200 OK**

```json
{
  "data": [
    {
      "id": "123",
      "nome": "Maria Silva",
      "data_nascimento": "2015-03-10",
      "bairro": "Centro",
      "responsavel": "João Silva",
      "saude": {},
      "educacao": {},
      "assistencia_social": {},
      "revisado": false,
      "revisado_por": null,
      "revisado_em": null,
      "total_alertas": 3
    }
  ],
  "page": 1,
  "size": 10,
  "total": 42
}
```

**400 Bad Request**

```json
{
  "error": "invalid query parameters"
}
```

---

### GET /children/{id}

Retorna os detalhes de uma criança específica.

#### Parâmetros de Rota

| Parâmetro | Tipo   | Descrição                |
| --------- | ------ | ------------------------ |
| id        | string | Identificador da criança |

#### Resposta

**200 OK**

```json
{
  "id": "123",
  "nome": "Maria Silva",
  "data_nascimento": "2015-03-10",
  "bairro": "Centro",
  "responsavel": "João Silva",
  "saude": {},
  "educacao": {},
  "assistencia_social": {},
  "revisado": true,
  "revisado_por": "admin@example.com",
  "revisado_em": "2025-01-01T12:00:00Z",
  "total_alertas": 3
}
```

**404 Not Found**

```json
{
  "error": "child not found"
}
```

---

### PATCH /children/{id}/review

Marca uma criança como revisada.

O e-mail do usuário autenticado é registrado automaticamente como responsável pela revisão.

#### Parâmetros de Rota

| Parâmetro | Tipo   | Descrição                |
| --------- | ------ | ------------------------ |
| id        | string | Identificador da criança |

#### Respostas

**204 No Content**

Sem corpo de resposta.

**404 Not Found**

```json
{
  "error": "child not found"
}
```

---

## Resumo do Dashboard

### GET /summary

Retorna métricas consolidadas e estatísticas de alertas para o dashboard.

#### Resposta

**200 OK**

```json
{
  "total_of_children": 120,
  "already_reviewed": 45,
  "alerts_by_domain": [
    {
      "domain_name": "Saúde",
      "total": 18
    },
    {
      "domain_name": "Educação",
      "total": 11
    },
    {
      "domain_name": "Assistência Social",
      "total": 7
    }
  ]
}
```

### Estrutura da Resposta

| Campo             | Tipo    |
| ----------------- | ------- |
| total_of_children | integer |
| already_reviewed  | integer |
| alerts_by_domain  | array   |

#### AlertByDomain

| Campo       | Tipo    |
| ----------- | ------- |
| domain_name | string  |
| total       | integer |

---

## Respostas de Erro

Todos os endpoints podem retornar:

```json
{
  "error": "internal error"
}
```

com o status:

```http
500 Internal Server Error
```
