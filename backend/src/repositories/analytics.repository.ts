import { db } from "../db/index";
import { pagamento } from "../db/schemas/schemas";

export class AnalyticsRepository {
  async getPagamentosAll(): Promise<any[]> {
    // return payments with the related plan (if any)
    return await db.query.pagamento.findMany({
      with: {
        plano: true,
      },
    });
  }
}

export default AnalyticsRepository;
