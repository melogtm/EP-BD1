# Configurando o Ambiente Local

Siga os passos abaixo para clonar e configurar o projeto em sua máquina.

1. Clonar o Repositório

```bash

git clone <URL_DO_SEU_REPOSITORIO_GIT>
cd <NOME_DA_PASTA_DO_PROJETO>
```

2. Instalar as Dependências

Este comando irá instalar todos os pacotes listados no package.json.
Bash

```bash
yarn 
```

# Configurar as Variáveis de Ambiente

As variáveis de ambiente são usadas para armazenar informações sensíveis, como as credenciais do banco de dados.

Copie o arquivo de exemplo .env.example para um novo arquivo chamado .env.

```bash
cp .env.example .env
```


# Executar as Migrations do Banco de Dados

Com o banco de dados rodando, precisamos criar as tabelas. O Prisma faz isso de forma automática. Este comando irá ler o schema.prisma e aplicar a estrutura no banco.

```bash
npx prisma migrate dev
```


# Rodando a Aplicação

Com tudo configurado, você pode iniciar o servidor de desenvolvimento:

```bash
yarn dev
```
O servidor estará rodando e escutando na porta 3000. Você pode acessá-lo em http://localhost:3000. O servidor reiniciará automaticamente sempre que você salvar uma alteração nos arquivos.

# Trabalhando com Migrations

O Prisma gerencia a evolução do schema do banco de dados através de migrations.

    Para aplicar migrations existentes (ex: depois de um git pull que trouxe novas alterações no schema), rode:

```bash
npx prisma migrate dev
```

Para criar uma nova migration (depois que você alterou o arquivo prisma/schema.prisma), rode:

```bash
npx prisma migrate dev --name "nome-descritivo-da-sua-alteracao"
```
Exemplo: npx prisma migrate dev --name "adiciona-campo-de-preco-em-livro"