import { PostgresError } from "postgres";

interface HttpErrorInfo {
  statusCode: number;
  message: string;
  detail?: string;
}

export function mapPostgresErrorToHttp(error: unknown): HttpErrorInfo {
  // O erro do Drizzle encapsula o PostgresError em error.cause
  const pgError = (error as any)?.cause;

  if (pgError && pgError.code) {
    const code = pgError.code;
    const constraintName = pgError.constraint_name;
    const detail = pgError.detail;

    switch (code) {
      case "23503": // foreign key violation
        return {
          statusCode: 400,
          message: `Violação de chave estrangeira (${constraintName}): valor relacionado não existe.`,
          detail: detail,
        };

      case "23505": // unique violation
        return {
          statusCode: 409,
          message: `Violação de restrição única (${constraintName}): valor duplicado não permitido.`,
          detail: detail,
        };

      case "23502": // not null violation
        return {
          statusCode: 400,
          message: `Campo obrigatório não pode ser nulo: ${
            pgError.column_name || "desconhecido"
          }.`,
          detail: detail,
        };

      case "23514": // check violation
        if (constraintName === "chk_origem_pagamento") {
          return {
            statusCode: 400,
            message:
              "Violação CHECK (chkOrigemPagamento): pagamento deve referenciar OU consulta OU exame, não ambos.",
            detail: detail,
          };
        }
        return {
          statusCode: 400,
          message: `Violação de restrição CHECK (${constraintName}): valor não atende às regras.`,
          detail: detail,
        };

      case "22001": // value too long
        return {
          statusCode: 400,
          message: `Valor excede tamanho máximo: ${
            pgError.column_name || "desconhecido"
          }.`,
          detail: detail,
        };

      case "22003": // numeric value out of range
        return {
          statusCode: 400,
          message: `Valor numérico fora do intervalo: ${
            pgError.column_name || "desconhecido"
          }.`,
          detail: detail,
        };

      case "42703": // undefined column
        return {
          statusCode: 400,
          message: `Campo desconhecido: ${
            pgError.column_name || "desconhecido"
          }.`,
          detail: detail,
        };

      case "42P01": // undefined table
        return {
          statusCode: 500,
          message: "Tabela não encontrada.",
          detail: detail,
        };

      default:
        return {
          statusCode: 500,
          message: `Erro no banco (código: ${code}).`,
          detail: pgError.message,
        };
    }
  }

  // Se for Error comum
  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message || "Erro interno.",
    };
  }

  return {
    statusCode: 500,
    message: "Erro interno no servidor.",
  };
}
