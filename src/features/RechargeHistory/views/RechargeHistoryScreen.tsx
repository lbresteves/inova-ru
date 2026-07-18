import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { TableContent } from "@/src/shared/components/Table/TableContent";
import { TableFilterButton } from "@/src/shared/components/Table/TableFilterButton";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { getApiErrorMessage } from "@shared/api";
import {
  getPeriodRange,
  PERIOD_ALL,
  PERIOD_OPTIONS,
  PERIOD_THIS_MONTH,
} from "@shared/utils/dateRange";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { useRechargeHistoryInfiniteQuery } from "../hooks/useRechargeHistoryInfiniteQuery";
import type { RechargeHistoryFilters, RechargeHistoryItem } from "../types/RechargeHistory";
import { formatCurrency, formatDateTime, formatStatus } from "../utils/TextFormat";
import {
  Container,
  ItemLeft,
  ItemLeftSub,
  ItemLeftTitle,
  ItemStatusApproved,
  ItemStatusExpired,
  Table,
  TableHeader,
  TableItem,
} from "./styles/RechargeHistory.styled";

function isApprovedStatus(status: string): boolean {
  return ["aprovado", "approved"].includes(status.toLowerCase());
}

export default function RechargeHistoryScreen() {
  const [filters, setFilters] = useState<RechargeHistoryFilters>({});
  const [periodPreset, setPeriodPreset] = useState(PERIOD_ALL);
  const [thisMonthPreset, setThisMonthPreset] = useState(false);
  const historyQuery = useRechargeHistoryInfiniteQuery(filters);
  const items = useMemo(
    () => historyQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [historyQuery.data],
  );

  const handlePeriodChange = (preset: number) => {
    setPeriodPreset(preset);
    setThisMonthPreset(preset === PERIOD_THIS_MONTH);
    setFilters(getPeriodRange(preset));
  };

  const handleThisMonthToggle = (active: boolean) => {
    const preset = active ? PERIOD_THIS_MONTH : PERIOD_ALL;
    setPeriodPreset(preset);
    setThisMonthPreset(active);
    setFilters(getPeriodRange(preset));
  };

  return (
    <Container>
      <HeaderBack title="Histórico de Recargas" onReturnPress={() => router.replace("/main/home")} />
      <Table>
        <TableHeader>
          <TableFilterSelect
            value={periodPreset}
            defaultValue={PERIOD_ALL}
            options={PERIOD_OPTIONS}
            onChange={(period: number) => handlePeriodChange(period)}
          />
          <TableFilterButton
            value={thisMonthPreset}
            onChange={(thisMonth: boolean) => handleThisMonthToggle(thisMonth)}
            title="Este mês"
          />
        </TableHeader>
        <TableContent<RechargeHistoryItem>
          data={items}
          emptyMessage="Nenhuma recarga encontrada para os filtros selecionados."
          errorMessage={historyQuery.isError ? getApiErrorMessage(historyQuery.error) : undefined}
          hasNextPage={historyQuery.hasNextPage}
          isFetchingNextPage={historyQuery.isFetchingNextPage}
          isInitialLoading={historyQuery.isLoading}
          isRefreshing={historyQuery.isRefetching && !historyQuery.isFetchingNextPage}
          keyExtractor={(item) => `${item.id}`}
          onEndReached={() => void historyQuery.fetchNextPage()}
          onRefresh={() => void historyQuery.refetch()}
          onRetry={() => void historyQuery.refetch()}
          renderItem={({ item }) => (
            <TableItem>
              <ItemLeft>
                <ItemLeftTitle>{formatCurrency(item.amount)}</ItemLeftTitle>
                <ItemLeftSub>{item.method.toUpperCase()} · {formatDateTime(item.dateTime)}</ItemLeftSub>
              </ItemLeft>
              {isApprovedStatus(item.status) ? (
                <ItemStatusApproved>{formatStatus(item.status)}</ItemStatusApproved>
              ) : (
                <ItemStatusExpired>{formatStatus(item.status)}</ItemStatusExpired>
              )}
            </TableItem>
          )}
        />
      </Table>
    </Container>
  );
}
