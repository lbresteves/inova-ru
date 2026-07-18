import {
  assertRecord,
  createContractError,
  readNumber,
  readString,
} from "@shared/api";
import type { CreditAccount } from "../types/CreditAccount";
import type { CreditAccountResponseDto } from "../types/CreditAccountDto";

function mapSituation(value: string): CreditAccount["consumer"]["situation"] {
  switch (value) {
    case "A":
      return "active";
    case "I":
      return "inactive";
    case "B":
      return "blocked";
    default:
      throw createContractError("Situação do consumidor desconhecida.", value);
  }
}

export function mapCreditAccount(dto: CreditAccountResponseDto): CreditAccount {
  const root = assertRecord(dto, "creditAccount");
  const consumidor = assertRecord(root.consumidor, "consumidor");
  const tipoConsumidor = assertRecord(
    consumidor.tipo_consumidor,
    "consumidor.tipo_consumidor",
  );
  const centroCusto = assertRecord(
    consumidor.centro_custo,
    "consumidor.centro_custo",
  );
  const saldo = assertRecord(root.saldo, "saldo");
  const rawSituation = readString(consumidor, "situacao") as "A" | "I" | "B";
  const situation = mapSituation(rawSituation);

  const balance = {
    current: readNumber(saldo, "credito_disponivel", "saldo.credito_disponivel"),
    limit: readNumber(saldo, "limite_recarga", "saldo.limite_recarga"),
  };

  return {
    balance,
    consumer: {
      category: {
        code: readString(tipoConsumidor, "codigo", "tipo_consumidor.codigo"),
        description: readString(tipoConsumidor, "descricao", "tipo_consumidor.descricao"),
      },
      costCenter: {
        description: readString(centroCusto, "descricao", "centro_custo.descricao"),
        type: readString(centroCusto, "tipo", "centro_custo.tipo"),
      },
      name: readString(consumidor, "nome", "consumidor.nome"),
      rawSituation,
      situation,
    },
    permissions: {
      canConsume: situation === "active",
      canRecharge: situation === "active",
    },
  };
}
