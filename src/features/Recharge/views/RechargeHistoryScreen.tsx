import {
  AppButton,
  PageHeader,
  ScreenContent,
  ScrollScreen,
  SelectionModal,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useRechargeHistoryQuery } from "../hooks/useRechargeHistoryQuery";
import {
  Amount,
  Badge,
  BadgeText,
  DateText,
  EmptyState,
  FilterButton,
  Filters,
  FilterText,
  HistoryCard,
  HistoryInfo,
  HistoryList,
  StateText,
} from "./styles/RechargeHistoryScreen.styled";

type PeriodFilter = "all" | "30days";
type StatusFilter = "all" | "approved" | "expired";

export default function RechargeHistoryScreen() {
  const router = useRouter();
  const historyQuery = useRechargeHistoryQuery();
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [openSelector, setOpenSelector] = useState<"period" | "status" | null>(null);

  const visibleItems = useMemo(() => {
    const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return (historyQuery.data ?? []).filter((item) => {
      const matchesPeriod =
        period === "all" || (item.timestamp ? new Date(item.timestamp).getTime() >= threshold : true);
      const matchesStatus =
        status === "all" ||
        (status === "approved" && item.status === "Aprovado") ||
        (status === "expired" && item.status === "Expirado");
      return matchesPeriod && matchesStatus;
    });
  }, [historyQuery.data, period, status]);

  return (
    <ScrollScreen>
      <PageHeader title="Histórico de Recargas" onBack={() => router.back()} />
      <ScreenContent>
        <Filters>
          <FilterButton accessibilityRole="button" onPress={() => setOpenSelector("period")}>
            <FilterText>{period === "all" ? "Todo o período" : "Últimos 30 dias"} ▾</FilterText>
          </FilterButton>
          <FilterButton accessibilityRole="button" onPress={() => setOpenSelector("status")}>
            <FilterText>
              {status === "all" ? "Todos os status" : status === "approved" ? "Aprovadas" : "Expiradas"} ▾
            </FilterText>
          </FilterButton>
        </Filters>

        {historyQuery.isPending ? (
          <EmptyState><StateText>Carregando recargas…</StateText></EmptyState>
        ) : historyQuery.isError ? (
          <EmptyState>
            <StateText>Não foi possível carregar as recargas.</StateText>
            <AppButton label="Tentar novamente" onPress={() => historyQuery.refetch()} variant="outlined" />
          </EmptyState>
        ) : visibleItems.length === 0 ? (
          <EmptyState><StateText>Nenhuma recarga encontrada para os filtros selecionados.</StateText></EmptyState>
        ) : (
          <HistoryList>
            {visibleItems.map((item) => {
              const approved = item.status === "Aprovado";
              return (
                <HistoryCard key={item.id}>
                  <HistoryInfo>
                    <Amount>{item.amount}</Amount>
                    <DateText>{item.date}</DateText>
                  </HistoryInfo>
                  <Badge approved={approved}>
                    <BadgeText approved={approved}>{item.status}</BadgeText>
                  </Badge>
                </HistoryCard>
              );
            })}
          </HistoryList>
        )}
      </ScreenContent>

      <SelectionModal<PeriodFilter>
        onClose={() => setOpenSelector(null)}
        onSelect={setPeriod}
        options={[
          { label: "Todo o período", value: "all" },
          { label: "Últimos 30 dias", value: "30days" },
        ]}
        selectedValue={period}
        title="Selecionar período"
        visible={openSelector === "period"}
      />
      <SelectionModal<StatusFilter>
        onClose={() => setOpenSelector(null)}
        onSelect={setStatus}
        options={[
          { label: "Todos os status", value: "all" },
          { label: "Aprovadas", value: "approved" },
          { label: "Expiradas", value: "expired" },
        ]}
        selectedValue={status}
        title="Selecionar status"
        visible={openSelector === "status"}
      />
    </ScrollScreen>
  );
}
