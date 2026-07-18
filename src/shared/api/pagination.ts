import { createContractError } from "./ApiError";
import { assertRecord, readNumber } from "./validation";

export type Pagination = {
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
};

export type PaginatedResponseDto<TItem> = {
  data: TItem[];
  pagination: Pagination;
};

export function readArray(record: Record<string, unknown>, key: string): unknown[] {
  const value = record[key];
  if (Array.isArray(value)) {
    return value;
  }

  throw createContractError(`Campo ${key} inválido.`, record);
}

export function mapPagination(value: unknown): Pagination {
  const pagination = assertRecord(value, "pagination");
  const result = {
    currentPage: readNumber(pagination, "currentPage", "pagination.currentPage"),
    lastPage: readNumber(pagination, "lastPage", "pagination.lastPage"),
    perPage: readNumber(pagination, "perPage", "pagination.perPage"),
    total: readNumber(pagination, "total", "pagination.total"),
  };

  if (
    result.currentPage < 1 ||
    result.lastPage < 1 ||
    result.perPage < 1 ||
    result.total < 0
  ) {
    throw createContractError("Paginação inválida.", value);
  }

  return result;
}

export function mapPaginatedResponse<TItem>(
  value: unknown,
  mapItem: (item: unknown) => TItem,
): PaginatedResponseDto<TItem> {
  const root = assertRecord(value, "paginatedResponse");
  return {
    data: readArray(root, "data").map(mapItem),
    pagination: mapPagination(root.pagination),
  };
}
