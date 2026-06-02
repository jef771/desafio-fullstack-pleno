# Minha solução para o Desafio Backend Pleno
O desafio se tratava em criar um serviço de notificações para cidadãos acompanharem a evolução dos chamados municipais do Rio de Janeiro em tempo real.

Foquei em deixar a solução simples pois a ideia inicial do serviço parece ser simples.

Portanto decidi seguir uma arquitetura que lembra um monolito separando as responsabilidades para deixar claro o objetivo da aplicação.

Como exemplo temos o fluxo do Webhook:

Webhook Provider
→ POST /webhook/status
→ Handler.Wh
→ VerifySignature (HMAC)
→ WebhookService.Process
   → check duplicação
   → insert caso não seja duplicado
→ BroadcastToCPF
→ WebSocket clients

Em nenhum momento "voltamos" um layer, apenas seguimos o fluxo.

# Endpoints
### Webhook

`POST /webhook/status
Content-Type: application/json
X-Signature-256: sha256=<HMAC-SHA256 do body + WEBHOOK_SECRET>`

| Status Code | Response Body / Message                              | Descrição                                                  |
|-------------|------------------------------------------------------|--------------------------------------------------------------|
| 201         | —                                                    | Evento processado e notificação criada                      |
| 200         | `{"message": "notification already processed"}`     | Evento já processado em outro momento                       |
| 401         | —                                                    | Assinatura ausente ou inválida                              |
| 400         | —                                                    | Campos obrigatórios ausentes ou campo de status inválido   |
| 500         | —                                                    | Erro inesperado ao processar evento de status              |


> Aqui o que achei interessante fazer foi voltar 201 quando o evento resultou em uma persistência (tanto que no código eu nomeei a var de "persisted") e 200 quando ele já existe no banco.
O processo foi normal, primeiro checo no banco com exists e volto 200 se já existir ou 201 se a persistência deu certo.

### REST API

Todas as rotas exigem Authorization: Bearer <JWT> com preferred_username = <CPF do cidadão>.

`GET  /notifications?page=1&page_size=20`
`GET  /notifications/unread-count`
`PATCH /notifications/:id/read`

#### GET /notifications?page=1&page_size=20:
[
  {
    "id": 1,
    "chamado_id": "123",
    "status": "concluido",
    "titulo": "Chamado concluído",
    "descricao": "Seu chamado foi concluído com sucesso",
    "timestamp": "2026-05-29T15:22:12.051254Z"
  }, ...
]

#### GET /notifications/unread-count
{
  "total_count": 1
}

#### PATCH /notifications/:id/read
{
  "id": 1
}

> Como é um serviço simples e pequeno fiz a paginação na query mesmo, com COUNT e ORDER porém com o index no CPF ela ficou com uma boa velocidade. 
> Outro ponto interessante é que no /notifications/:id/read retornei 404 como erro, já que o cidadão mandou uma requisição com um ID disponível na plataforma, portanto provavelmente é um erro não termos achado


#### WS /ws?token=<JWT>

Enviamos a notificação, que foi persistida, ao cliente que está conectado nesse endpoint.


# Como rodar
- Será necessário instalar just e docker
- Abrir um terminal de sua preferência e digitar `just test`, só isso já deve subir o docker e rodar os testes do projeto.
  - Caso dê algum problema verifique o arquivo justfile, como eu codei no linux o ruindows pode reclamar de algo 
- `docker compose up` para subir o projeto e testar manualmente


> Fiz um endpoint para login para deixar os testes manuais mais fáceis: `curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d '{ "cpf":"12345678901" }'`
> a response é o TOKEN para você utilizar nos outros endpoints


Já no endpoint do webhook você vai precisar de uma assinatura que leva o body + secret
- No Linux é só colocar no terminal:
```bash
BODY='{"chamado_id":"123","tipo":"status_changed","cpf":"12345678901","status_anterior":"aberto","status_novo":"concluido","titulo":"Chamado concluído","descricao":"Seu chamado foi concluído com sucesso","timestamp":"2026-05-28T15:04:05Z"}'
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "my_webhook_secret" | sed 's/^.* //')
```
- No Windows:
```shell
$body = '{"chamado_id":"123","tipo":"status_changed","cpf":"12345678901","status_anterior":"aberto","status_novo":"concluido","titulo":"Chamado concluído","descricao":"Seu chamado foi concluído com sucesso","timestamp":"2026-05-28T15:04:05Z"}'

$secret = "my_webhook_secret"

$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [Text.Encoding]::UTF8.GetBytes($secret)

$hash = $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($body))

$signature = ($hash | ForEach-Object { $_.ToString("x2") }) -join ""

$signature
```

Dessa forma você terá a assinatura esperada para o endpoint do webhook.


# O que eu faria se tivesse mais tempo

- Adicionaria um rate limit entre plataforma e Webhook
- Testes de integração para percorrer o serviço inteiro dispensando o teste manual
- Métricas em um Datadog para acompanhar o RPM no Webhook
- Logs e Erros mais robusto


