CREATE TABLE "autor" (
	"rg" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"endereco" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_AutorToLivro" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_AutorToLivro_A_B_pk" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "contratada" (
	"grafica_id" integer PRIMARY KEY NOT NULL,
	"endereco" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contrato" (
	"id" serial PRIMARY KEY NOT NULL,
	"valor" numeric(65, 30) NOT NULL,
	"nome_responsavel" text NOT NULL,
	"grafica_cont_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Editora" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"endereco" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grafica" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imprime" (
	"lisbn" text NOT NULL,
	"grafica_id" integer NOT NULL,
	"nto_copias" integer,
	"data_entrega" timestamp (3),
	CONSTRAINT "imprime_lisbn_grafica_id_pk" PRIMARY KEY("lisbn","grafica_id")
);
--> statement-breakpoint
CREATE TABLE "livros" (
	"isbn" text PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"data_de_publicacao" timestamp (3) NOT NULL,
	"editora_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "particular" (
	"grafica_id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "_AutorToLivro" ADD CONSTRAINT "_AutorToLivro_A_autor_rg_fk" FOREIGN KEY ("A") REFERENCES "public"."autor"("rg") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_AutorToLivro" ADD CONSTRAINT "_AutorToLivro_B_livros_isbn_fk" FOREIGN KEY ("B") REFERENCES "public"."livros"("isbn") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "contratada" ADD CONSTRAINT "contratada_grafica_id_grafica_id_fk" FOREIGN KEY ("grafica_id") REFERENCES "public"."grafica"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "contrato" ADD CONSTRAINT "contrato_grafica_cont_id_contratada_grafica_id_fk" FOREIGN KEY ("grafica_cont_id") REFERENCES "public"."contratada"("grafica_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "imprime" ADD CONSTRAINT "imprime_lisbn_livros_isbn_fk" FOREIGN KEY ("lisbn") REFERENCES "public"."livros"("isbn") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "imprime" ADD CONSTRAINT "imprime_grafica_id_grafica_id_fk" FOREIGN KEY ("grafica_id") REFERENCES "public"."grafica"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "livros" ADD CONSTRAINT "livros_editora_id_Editora_id_fk" FOREIGN KEY ("editora_id") REFERENCES "public"."Editora"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "particular" ADD CONSTRAINT "particular_grafica_id_grafica_id_fk" FOREIGN KEY ("grafica_id") REFERENCES "public"."grafica"("id") ON DELETE restrict ON UPDATE cascade;