# Instruções para rodar o backend

Pré-requisitos
- Ter o Node.js instalado
- Ter o Docker instalado

Passos para rodar o backend

1) Rodar o banco de dados PostgreSQL:
docker run --name meu_postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=epbd1 -e POSTGRES_USER=postgres -p 5432:5432 -d postgres:16-alpine

Aguarde até que o container esteja completamente iniciado.

2) Instalar as dependências do projeto:
npm i

3) Rodar o backend em modo desenvolvimento:
npm run dev

4) npm run db:generate

5) npm run db:migrate

Após esses passos, o backend estará rodando e conectado ao banco de dados PostgreSQL no container Docker.
