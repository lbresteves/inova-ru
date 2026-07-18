import {
  assertRecord,
  mapPaginatedResponse,
  readDateString,
  readNumber,
  readString,
} from "@shared/api";
import type {
  RechargeHistoryItem,
  RechargeHistoryPage,
} from "../types/RechargeHistory";

export function mapRechargeHistoryItem(value: unknown): RechargeHistoryItem {
  const item = assertRecord(value, "recarga");
  return {
    amount: readNumber(item, "valor", "recarga.valor"),
    dateTime: readDateString(item, "data_hora"),
    id: readNumber(item, "id", "recarga.id"),
    method: readString(item, "metodo", "recarga.metodo"),
    status: readString(item, "status", "recarga.status"),
  };
}

export function mapRechargeHistoryPage(value: unknown): RechargeHistoryPage {
  return mapPaginatedResponse(value, mapRechargeHistoryItem);
}
