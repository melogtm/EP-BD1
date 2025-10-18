-- CreateTable
CREATE TABLE "Editora" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "Editora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livros" (
    "isbn" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data_de_publicacao" TIMESTAMP(3) NOT NULL,
    "editora_id" INTEGER NOT NULL,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "autor" (
    "rg" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "autor_pkey" PRIMARY KEY ("rg")
);

-- CreateTable
CREATE TABLE "grafica" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "grafica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "particular" (
    "grafica_id" INTEGER NOT NULL,

    CONSTRAINT "particular_pkey" PRIMARY KEY ("grafica_id")
);

-- CreateTable
CREATE TABLE "contratada" (
    "grafica_id" INTEGER NOT NULL,
    "endereco" TEXT NOT NULL,

    CONSTRAINT "contratada_pkey" PRIMARY KEY ("grafica_id")
);

-- CreateTable
CREATE TABLE "contrato" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "nome_responsavel" TEXT NOT NULL,
    "grafica_cont_id" INTEGER NOT NULL,

    CONSTRAINT "contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imprime" (
    "lisbn" TEXT NOT NULL,
    "grafica_id" INTEGER NOT NULL,
    "nto_copias" INTEGER,
    "data_entrega" TIMESTAMP(3),

    CONSTRAINT "imprime_pkey" PRIMARY KEY ("lisbn","grafica_id")
);

-- CreateTable
CREATE TABLE "_AutorToLivro" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AutorToLivro_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AutorToLivro_B_index" ON "_AutorToLivro"("B");

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_editora_id_fkey" FOREIGN KEY ("editora_id") REFERENCES "Editora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "particular" ADD CONSTRAINT "particular_grafica_id_fkey" FOREIGN KEY ("grafica_id") REFERENCES "grafica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratada" ADD CONSTRAINT "contratada_grafica_id_fkey" FOREIGN KEY ("grafica_id") REFERENCES "grafica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_grafica_cont_id_fkey" FOREIGN KEY ("grafica_cont_id") REFERENCES "contratada"("grafica_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imprime" ADD CONSTRAINT "imprime_lisbn_fkey" FOREIGN KEY ("lisbn") REFERENCES "livros"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imprime" ADD CONSTRAINT "imprime_grafica_id_fkey" FOREIGN KEY ("grafica_id") REFERENCES "grafica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutorToLivro" ADD CONSTRAINT "_AutorToLivro_A_fkey" FOREIGN KEY ("A") REFERENCES "autor"("rg") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutorToLivro" ADD CONSTRAINT "_AutorToLivro_B_fkey" FOREIGN KEY ("B") REFERENCES "livros"("isbn") ON DELETE CASCADE ON UPDATE CASCADE;
