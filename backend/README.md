# 🚀 Backend - Instruções de Instalação

## 📋 Pré-requisitos

- **Node.js** 18+ instalado ([download](https://nodejs.org))
- **Docker** instalado ([download](https://www.docker.com/products/docker-desktop))

---

## 🔧 Passos para Rodar o Backend

### 1️⃣ Iniciar o Banco de Dados PostgreSQL

Execute o comando para criar e iniciar um container Docker com PostgreSQL:

```bash
docker run --name epbd1_postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=epbd1 \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**Aguarde 5-10 segundos** para que o container esteja completamente iniciado.

**Verificar se está rodando:**
```bash
docker ps | grep epbd1_postgres
```

---

### 2️⃣ Instalar Dependências do Projeto

```bash
npm i
```

Isso instalará todas as dependências listadas em `package.json`.

---

### 3️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a configuração do banco de dados:

```bash
echo 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/epbd1' > .env
```

**Ou manualmente:** Crie o arquivo `.env` e adicione:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/epbd1
```

---

### 4️⃣ Gerar Migrations SQL

Drizzle ORM gerará os arquivos SQL baseado nas entidades:

```bash
npm run db:generate
```

Isso criará as migrations em `drizzle/migrations/`.

---

### 5️⃣ Aplicar Migrations ao Banco de Dados

```bash
npm run db:migrate
```

Isso executará as migrations e criará as tabelas no PostgreSQL.

---

### 6️⃣ Rodar o Backend em Modo Desenvolvimento

```bash
npm run dev
```

O backend estará rodando em **`http://localhost:3000`**

---

## ✅ Verificação Final

Se tudo correu bem, você deverá ver no terminal:
```
Servidor rodando na porta 3000
```

E a API estará pronta para receber requisições.

---

## 🛑 Parar o Backend e Banco de Dados

**Parar o backend:**
- Pressione `Ctrl + C` no terminal

**Parar o container PostgreSQL:**
```bash
docker stop epbd1_postgres
```

**Remover o container (opcional):**
```bash
docker rm epbd1_postgres
```

---

## 📝 Scripts Disponíveis

```bash
npm run dev              # Rodar em desenvolvimento
npm run build            # Build para produção
npm run db:generate      # Gerar migrations SQL
npm run db:migrate       # Aplicar migrations
npm run db:studio        # Abrir Drizzle Studio (opcional)
```

---

## 🆘 Troubleshooting

### Erro: "Connection refused" na porta 5432
- Verifique se o container está rodando: `docker ps`
- Se não estiver, reinicie: `docker start epbd1_postgres`

### Erro: "Database already exists"
- Remova o container antigo: `docker rm -f epbd1_postgres`
- Execute novamente o comando de criação

### Porta 5432 já em uso
- Se outra aplicação está usando a porta, mude a porta do container:
  ```bash
  docker run --name epbd1_postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=epbd1 -e POSTGRES_USER=postgres -p 5433:5432 -d postgres:16-alpine
  ```
  Depois atualize `DATABASE_URL` para usar porta `5433`

### Migrations falharam
- Verifique se o banco está rodando
- Limpe o container e tente novamente:
  ```bash
  docker stop epbd1_postgres && docker rm epbd1_postgres
  ```

---

## 📦 Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** NestJS / Express
- **Banco de Dados:** PostgreSQL 16
- **ORM:** Drizzle ORM
- **Containerização:** Docker

---

## 🔗 Endpoints Principais

Base URL: `http://localhost:3000`

Exemplos:
- `GET /diagnosticos` - Listar diagnósticos
- `POST /pacientes` - Criar paciente
- `GET /funcionarios` - Listar funcionários
- Veja a documentação completa da API para todos os endpoints

---

## 📞 Suporte

Para mais informações, veja o README.md na raiz do projeto.