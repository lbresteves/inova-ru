import {
  assertRecord,
  createContractError,
  mapPaginatedResponse,
  readBoolean,
  readDateString,
  readInteger,
  readNumber,
  readString,
} from "@shared/api";
import type { MealHistoryItem, MealHistoryPage } from "../types/MealHistory";

const RESTAURANT_CODES = new Set(["0001", "0002", "0003", "0004", "0005"]);

export function mapMealHistoryItem(value: unknown): MealHistoryItem {
  const item = assertRecord(value, "refeicao");
  const branch = assertRecord(item.filial, "refeicao.filial");
  const branchCode = readString(branch, "codigo", "refeicao.filial.codigo");
  const quantity = readInteger(item, "quantidade", "refeicao.quantidade");
  const totalAmount = readNumber(
    item,
    "valor_total",
    "refeicao.valor_total",
  );

  if (!RESTAURANT_CODES.has(branchCode) || quantity < 1 || totalAmount < 0) {
    throw createContractError("Item de refeição inválido.", item);
  }

  return {
    branch: {
      code: branchCode,
      name: readString(branch, "nome", "refeicao.filial.nome"),
    },
    consumerType: readString(
      item,
      "tipo_consumidor",
      "refeicao.tipo_consumidor",
    ),
    dateTime: readDateString(item, "data_hora"),
    free: readBoolean(item, "gratuidade"),
    quantity,
    totalAmount,
  };
}

export function mapMealHistoryPage(value: unknown): MealHistoryPage {
  return mapPaginatedResponse(value, mapMealHistoryItem);
}
