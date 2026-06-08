# Painel de Monitoramento Infantil
Essa é a minha solução para o desafio de fullstack pleno apresentado pela Prefeitura do Rio de janeiro.

Codei o App com o objetivo de ser simples, objetivo e de fácil uso.

## Como rodar
O App requer [Docker](https://www.docker.com/) e, caso queira rodar os testes, [playwright](https://playwright.dev/) e [just](https://github.com/casey/just).

```bash
git clone git@github.com:jef771/desafio-fullstack-pleno.git
cd desafio-fullstack-pleno
docker compose up
```

O app vai rodar na porta 3000 e para logar são as credenciais previamente acordadas:
```
email: `tecnico@prefeitura.rio`
senha: `painel@2024`
```

> [docs](https://github.com/jef771/desafio-fullstack-pleno/blob/main/api_doc.md) das apis

## Decisões e trade-offs

### Arquitetura
Como um dos meus principais objetivos era deixar o App simples a arquitetura naturalmente também deveria seguir simples:
- Backend: segui o padrão do Golang com uma arquitetura em layers: repository, service e handler
```
backend/
├── cmd/
│   └── server/
├── docker/
│   └── postgres/
└── internal/
    ├── config/
    ├── handlers/
    ├── middleware/
    ├── models/
    ├── repository/
    ├── router/
    └── services/
```
> Seguiria com essa mesma arquitetura até mesmo em um ambiente prod pois funcionou muito bem
> 
- Banco de Dados:

<img width="400" height="500" alt="image" src="https://github.com/user-attachments/assets/66a11c8b-80e7-430e-b540-e5cdc3ae60d2" />
  
  - Como o foco não era o backend decidi fazer uma tabela simples e guardar as informações dos alertas dentro de campos json pela versatilidade, porém não seguiria dessa forma em prod.

- Frontend: fiz um híbrido entre convenções do framework com uma estruturação em componentes
```
src/
├── app/
│   ├── api/
│   ├── children/
│   └── login/
├── components/
│   ├── children/
│   └── dashboard/
├── lib/
└── types/
```
> Em um ambiente de prod eu melhoria essa arquitetura e focaria em separar regras de negócio, apesar de não existirem muitas

### Testes
Implementei testes unitários no backend e E2E no frontend com playwright.
O interessante é que os testes de repositório no backend usam um banco de dados teste, portanto os testes realmente comprovam que as queries estão funcionando, perdi algum tempo para configurar isso no docker porém acabei ganhando tempo quando fazia alguma mudança na query, era só rodar os testes e checar o que deu erro.

### Segurança
Utilizei biblioteca padrão do JWT em golang, o TOKEN é salvo em um cookie e toda vez que fazemos uma requisição o BFF pega esse token do cookie, ficou simples e fácil de trabalhar porém em um ambiente de prod acredito que guardaria em um redis pela maior segurança
As credenciais estão no docker-compose.yml, claro que em um ambiente prod elas deveriam estar em um AWS Secrets, porém a vantagem é que em um ambiente de dev não será necessário quebrar a cabeça para preparar o ambiente local, é só digitar docker compose up!

## O que faria com mais tempo
- Modelagem: como mencionei mais acima melhoria a modelagem da tabela children, faria uma modelagem mais genérica pronta para receber mais tipos e alertas

<img width="299" height="399" alt="image" src="https://github.com/user-attachments/assets/57509cc2-098e-4ee6-bda2-aa45b5de8985" />

- Melhoraria a arquitetura do frontend, apesar de já existir o BFF iria separar melhor as regras de negócio
- Padronização de erros do backend para o frontend
- Logs no backend
- Em caso de prod gostaria de um Datadog para saber a quantidade de crianças que esse app iria receber para melhorar a modelagem ou até mesmo se seria necessário uma fila com consumer



