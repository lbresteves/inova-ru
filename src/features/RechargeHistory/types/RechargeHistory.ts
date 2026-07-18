import type { DateRangeFilter } from "@shared/utils/dateRange";
import type { Pagination } from "@shared/api";

export type RechargeHistoryFilters = DateRangeFilter;

export type RechargeHistoryStatus = "aprovado" | "approved" | "pendente" | "pending" | "cancelado" | "cancelled" | "expirado" | "expired" | "rejeitado" | "rejected" | string;

export type RechargeHistoryItem = {
  id: number;
  amount: number;
  method: string;
  status: RechargeHistoryStatus;
  dateTime: string;
};

export type RechargeHistoryPage = {
  data: RechargeHistoryItem[];
  pagination: Pagination;
};
