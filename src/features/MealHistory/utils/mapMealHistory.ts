import {
  assertRecord,
  mapPaginatedResponse,
  readBoolean,
  readDateString,
  readNumber,
  readString,
} from "@shared/api";
import type { MealHistoryItem, MealHistoryPage } from "../types/MealHistory";

export function mapMealHistoryItem(value: unknown): MealHistoryItem {
  const item = assertRecord(value, "refeicao");
  const branch = assertRecord(item.filial, "refeicao.filial");

  return {
    branch: {
      code: readString(branch, "codigo", "refeicao.filial.codigo"),
      name: readString(branch, "nome", "refeicao.filial.nome"),
    },
    consumerType: readString(item, "tipo_consumidor", "refeicao.tipo_consumidor"),
    dateTime: readDateString(item, "data_hora"),
    free: readBoolean(item, "gratuidade"),
    quantity: readNumber(item, "quantidade", "refeicao.quantidade"),
    totalAmount: readNumber(item, "valor_total", "refeicao.valor_total"),
  };
}

export function mapMealHistoryPage(value: unknown): MealHistoryPage {
  return mapPaginatedResponse(value, mapMealHistoryItem);
}
