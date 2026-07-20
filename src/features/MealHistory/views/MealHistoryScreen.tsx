import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { TableContent } from "@/src/shared/components/Table/TableContent";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { getApiErrorMessage } from "@shared/api";
import {
  getPeriodRange,
  PERIOD_ALL,
  PERIOD_OPTIONS,
} from "@shared/utils/dateRange";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { useMealHistoryInfiniteQuery } from "../hooks/useMealHistoryInfiniteQuery";
import type { MealHistoryFilters, MealHistoryItem } from "../types/MealHistory";
import { formatCurrency, formatDate, formatTime } from "../utils/TextFormat";
import {
  Container,
  ItemLeft,
  ItemLeftSub,
  ItemLeftTitle,
  ItemStatusFree,
  ItemStatusNotFree,
  Table,
  TableHeader,
  TableItem,
} from "./styles/MealHistory.styled";

const RU_OPTIONS = [
  { label: "Todos os RUs", value: "" },
  { label: "RU Saúde/Direito", value: "0001" },
  { label: "RU Setorial 2", value: "0002" },
  { label: "RU Setorial 1", value: "0003" },
  { label: "RU ICA", value: "0004" },
  { label: "RU HRTN", value: "0005" },
];

export default function MealHistoryScreen() {
  const [filters, setFilters] = useState<MealHistoryFilters>({});
  const [periodPreset, setPeriodPreset] = useState(PERIOD_ALL);
  const [ruPreset, setRuPreset] = useState("");
  const historyQuery = useMealHistoryInfiniteQuery(filters);
  const items = useMemo(
    () => historyQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [historyQuery.data],
  );

  const handlePeriodChange = (preset: number) => {
    const range = getPeriodRange(preset);
    setPeriodPreset(preset);
    setFilters((current) => ({
      ...current,
      dataFim: range.dataFim,
      dataInicio: range.dataInicio,
    }));
  };

  const handleRuChange = (filial: string) => {
    setRuPreset(filial);
    setFilters((current) => ({ ...current, filial: filial || undefined }));
  };

  return (
    <Container>
      <HeaderBack title="Histórico de Refeições" onReturnPress={() => router.dismissTo("/main/home")} />
      <Table>
        <TableHeader>
          <TableFilterSelect
            value={periodPreset}
            defaultValue={PERIOD_ALL}
            options={PERIOD_OPTIONS}
            onChange={(period: number) => handlePeriodChange(period)}
          />
          <TableFilterSelect
            value={ruPreset}
            defaultValue=""
            options={RU_OPTIONS}
            onChange={(ru: string) => handleRuChange(ru)}
          />
        </TableHeader>
        <TableContent<MealHistoryItem>
          data={items}
          emptyMessage="Nenhuma refeição encontrada para os filtros selecionados."
          errorMessage={historyQuery.isError ? getApiErrorMessage(historyQuery.error) : undefined}
          hasNextPage={historyQuery.hasNextPage}
          isFetchingNextPage={historyQuery.isFetchingNextPage}
          isInitialLoading={historyQuery.isLoading}
          isRefreshing={historyQuery.isRefetching && !historyQuery.isFetchingNextPage}
          keyExtractor={(item, index) => `${item.dateTime}-${item.branch.code}-${index}`}
          onEndReached={() => void historyQuery.fetchNextPage()}
          onRefresh={() => void historyQuery.refetch()}
          onRetry={() => void historyQuery.refetch()}
          renderItem={({ item }) => (
            <TableItem>
              <ItemLeft>
                <ItemLeftTitle>{item.branch.name}</ItemLeftTitle>
                <ItemLeftSub>
                  {formatDate(item.dateTime)} · {formatTime(item.dateTime)} · {item.quantity} {item.quantity === 1 ? "refeição" : "refeições"}
                </ItemLeftSub>
              </ItemLeft>
              {item.free ? (
                <ItemStatusFree>Gratuita</ItemStatusFree>
              ) : (
                <ItemStatusNotFree>{formatCurrency(item.totalAmount)}</ItemStatusNotFree>
              )}
            </TableItem>
          )}
        />
      </Table>
    </Container>
  );
}
