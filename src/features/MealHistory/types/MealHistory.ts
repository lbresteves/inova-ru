import type { DateRangeFilter } from "@shared/utils/dateRange";
import type { Pagination } from "@shared/api";

export type MealHistoryFilters = DateRangeFilter & {
  filial?: string;
};

export type MealHistoryItem = {
  branch: {
    code: string;
    name: string;
  };
  consumerType: string;
  dateTime: string;
  free: boolean;
  quantity: number;
  totalAmount: number;
};

export type MealHistoryPage = {
  data: MealHistoryItem[];
  pagination: Pagination;
};
