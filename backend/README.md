# Configurando o Ambiente Local

Siga os passos abaixo para clonar e configurar o projeto em sua máquina.

---

## 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO_GIT>
cd <NOME_DA_PASTA_DO_PROJETO>
```

---

## 2. Instalar as Dependências

Este comando irá instalar todos os pacotes listados no package.json:

```bash
npm install
```

---

## 3. Configurar as Variáveis de Ambiente

As variáveis de ambiente são usadas para armazenar informações sensíveis, como as credenciais do banco de dados.

Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`:

```bash
cp .env.example .env
```

---

## 4. Subir o Banco de Dados (Docker)

Certifique-se de que o Docker está instalado e rodando.

Para subir os serviços:

```bash
docker compose up -d
```

Para derrubar:

```bash
docker compose down
```

---

## 5. Executar as Migrations do Banco de Dados (Drizzle)

Com o banco rodando, execute:

```bash
npm run db:migrate
```

Comandos úteis:

Gerar migrations automaticamente:
```bash
npm run db:generate
```

Aplicar alterações no banco sem gerar migration:
```bash
npm run db:push
```

Abrir o Drizzle Studio:
```bash
npm run db:studio
```

---

## 6. Rodando a Aplicação

Com tudo configurado, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando na porta **3000**:  
http://localhost:3000

O servidor reiniciará automaticamente sempre que você salvar uma alteração nos arquivos.

---

## 7. Trabalhando com Migrations

O Drizzle gerencia a evolução do banco através de migrations.

Aplicar migrations existentes (ex: depois de um git pull que alterou o schema):

```bash
npm run db:migrate
```

Criar uma nova migration após editar o schema:

```bash
npm run db:generate
```

Depois aplicar:

```bash
npm run db:migrate
```
