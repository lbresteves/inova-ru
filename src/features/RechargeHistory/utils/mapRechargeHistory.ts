import {
  assertRecord,
  createContractError,
  mapPaginatedResponse,
  readDateString,
  readInteger,
  readNumber,
  readString,
} from "@shared/api";
import type {
  RechargeHistoryItem,
  RechargeHistoryPage,
} from "../types/RechargeHistory";

export function mapRechargeHistoryItem(value: unknown): RechargeHistoryItem {
  const item = assertRecord(value, "recarga");
  const id = readInteger(item, "id", "recarga.id");
  const amount = readNumber(item, "valor", "recarga.valor");
  if (id < 1 || amount < 0) {
    throw createContractError("Item de recarga inválido.", item);
  }

  return {
    amount,
    dateTime: readDateString(item, "data_hora"),
    id,
    method: readString(item, "metodo", "recarga.metodo"),
    status: readString(item, "status", "recarga.status"),
  };
}

export function mapRechargeHistoryPage(value: unknown): RechargeHistoryPage {
  return mapPaginatedResponse(value, mapRechargeHistoryItem);
}
