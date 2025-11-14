import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabela Editora
export const editora = pgTable("editora", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  endereco: text("endereco").notNull(),
});

// Tabela Livros
export const livros = pgTable("livros", {
  isbn: text("isbn").primaryKey(),
  titulo: text("titulo").notNull(),
  dataDePublicacao: timestamp("data_de_publicacao", { precision: 3 }).notNull(),
  editoraId: integer("editora_id")
    .notNull()
    .references(() => editora.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

// Tabela Autor
export const autor = pgTable("autor", {
  rg: text("rg").primaryKey(),
  nome: text("nome").notNull(),
  endereco: text("endereco").notNull(),
});

// Tabela Grafica (tabela pai)
export const grafica = pgTable("grafica", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
});

// Tabela Particular (subtipo de Grafica)
export const particular = pgTable("particular", {
  graficaId: integer("grafica_id")
    .primaryKey()
    .references(() => grafica.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

// Tabela Contratada (subtipo de Grafica)
export const contratada = pgTable("contratada", {
  graficaId: integer("grafica_id")
    .primaryKey()
    .references(() => grafica.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  endereco: text("endereco").notNull(),
});

// Tabela Contrato
export const contrato = pgTable("contrato", {
  id: serial("id").primaryKey(),
  valor: decimal("valor", { precision: 65, scale: 30 }).notNull(),
  nomeResponsavel: text("nome_responsavel").notNull(),
  graficaContId: integer("grafica_cont_id")
    .notNull()
    .references(() => contratada.graficaId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

// Tabela Imprime (junction table entre Livros e Grafica)
export const imprime = pgTable(
  "imprime",
  {
    lisbn: text("lisbn")
      .notNull()
      .references(() => livros.isbn, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    graficaId: integer("grafica_id")
      .notNull()
      .references(() => grafica.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    ntoCopias: integer("nto_copias"),
    dataEntrega: timestamp("data_entrega", { precision: 3 }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.lisbn, table.graficaId] }),
  })
);

// Junction table entre Autor e Livros (many-to-many)
export const autorToLivro = pgTable(
  "_AutorToLivro",
  {
    A: text("A")
      .notNull()
      .references(() => autor.rg, { onDelete: "cascade", onUpdate: "cascade" }),
    B: text("B")
      .notNull()
      .references(() => livros.isbn, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.A, table.B] }),
  })
);

// ============ RELATIONS ============

// Relations para Editora
export const editoraRelations = relations(editora, ({ many }) => ({
  livros: many(livros),
}));

// Relations para Livros
export const livrosRelations = relations(livros, ({ one, many }) => ({
  editora: one(editora, {
    fields: [livros.editoraId],
    references: [editora.id],
  }),
  autores: many(autorToLivro),
  impressoes: many(imprime),
}));

// Relations para Autor
export const autorRelations = relations(autor, ({ many }) => ({
  livros: many(autorToLivro),
}));

// Relations para junction table AutorToLivro
export const autorToLivroRelations = relations(autorToLivro, ({ one }) => ({
  autor: one(autor, {
    fields: [autorToLivro.A],
    references: [autor.rg],
  }),
  livro: one(livros, {
    fields: [autorToLivro.B],
    references: [livros.isbn],
  }),
}));

// Relations para Grafica
export const graficaRelations = relations(grafica, ({ one, many }) => ({
  particular: one(particular, {
    fields: [grafica.id],
    references: [particular.graficaId],
  }),
  contratada: one(contratada, {
    fields: [grafica.id],
    references: [contratada.graficaId],
  }),
  impressoes: many(imprime),
}));

// Relations para Particular
export const particularRelations = relations(particular, ({ one }) => ({
  grafica: one(grafica, {
    fields: [particular.graficaId],
    references: [grafica.id],
  }),
}));

// Relations para Contratada
export const contratadaRelations = relations(contratada, ({ one, many }) => ({
  grafica: one(grafica, {
    fields: [contratada.graficaId],
    references: [grafica.id],
  }),
  contratos: many(contrato),
}));

// Relations para Contrato
export const contratoRelations = relations(contrato, ({ one }) => ({
  graficaContratada: one(contratada, {
    fields: [contrato.graficaContId],
    references: [contratada.graficaId],
  }),
}));

// Relations para Imprime
export const imprimeRelations = relations(imprime, ({ one }) => ({
  livro: one(livros, {
    fields: [imprime.lisbn],
    references: [livros.isbn],
  }),
  grafica: one(grafica, {
    fields: [imprime.graficaId],
    references: [grafica.id],
  }),
}));
