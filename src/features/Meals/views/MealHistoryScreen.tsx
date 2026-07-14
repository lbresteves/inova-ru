import {
  AppButton,
  PageHeader,
  ScreenContent,
  ScrollScreen,
  SelectionModal,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useMealHistoryQuery } from "../hooks/useMealHistoryQuery";
import {
  Amount,
  Card,
  DateText,
  EmptyState,
  FilterButton,
  Filters,
  FilterText,
  Info,
  List,
  Restaurant,
  StateText,
} from "./styles/MealHistoryScreen.styled";

type PeriodFilter = "all" | "30days";

export default function MealHistoryScreen() {
  const router = useRouter();
  const historyQuery = useMealHistoryQuery();
  const [restaurant, setRestaurant] = useState("all");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [openSelector, setOpenSelector] = useState<"restaurant" | "period" | null>(null);

  const restaurantOptions = useMemo(() => {
    const restaurants = Array.from(
      new Set(historyQuery.data?.map((item) => item.restaurant) ?? []),
    );
    return [
      { label: "Todos os RUs", value: "all" },
      ...restaurants.map((value) => ({ label: value, value })),
    ];
  }, [historyQuery.data]);

  const visibleItems = useMemo(() => {
    const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return (historyQuery.data ?? []).filter((item) => {
      const matchesRestaurant = restaurant === "all" || item.restaurant === restaurant;
      const matchesPeriod =
        period === "all" || (item.timestamp ? new Date(item.timestamp).getTime() >= threshold : true);
      return matchesRestaurant && matchesPeriod;
    });
  }, [historyQuery.data, period, restaurant]);

  const restaurantLabel =
    restaurantOptions.find((option) => option.value === restaurant)?.label ?? "Todos os RUs";

  return (
    <ScrollScreen>
      <PageHeader title="Histórico de Refeições" onBack={() => router.back()} />
      <ScreenContent>
        <Filters>
          <FilterButton accessibilityRole="button" onPress={() => setOpenSelector("restaurant")}>
            <FilterText>{restaurantLabel} ▾</FilterText>
          </FilterButton>
          <FilterButton accessibilityRole="button" onPress={() => setOpenSelector("period")}>
            <FilterText>{period === "all" ? "Todo o período" : "Últimos 30 dias"} ▾</FilterText>
          </FilterButton>
        </Filters>

        {historyQuery.isPending ? (
          <EmptyState><StateText>Carregando refeições…</StateText></EmptyState>
        ) : historyQuery.isError ? (
          <EmptyState>
            <StateText>Não foi possível carregar as refeições.</StateText>
            <AppButton label="Tentar novamente" onPress={() => historyQuery.refetch()} variant="outlined" />
          </EmptyState>
        ) : visibleItems.length === 0 ? (
          <EmptyState><StateText>Nenhuma refeição encontrada para os filtros selecionados.</StateText></EmptyState>
        ) : (
          <List>
            {visibleItems.map((item) => (
              <Card key={item.id}>
                <Info>
                  <Restaurant>{item.restaurant}</Restaurant>
                  <DateText>{item.date}</DateText>
                </Info>
                <Amount free={item.amount === "Gratuita"}>{item.amount}</Amount>
              </Card>
            ))}
          </List>
        )}
      </ScreenContent>

      <SelectionModal
        onClose={() => setOpenSelector(null)}
        onSelect={setRestaurant}
        options={restaurantOptions}
        selectedValue={restaurant}
        title="Selecionar restaurante"
        visible={openSelector === "restaurant"}
      />
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
    </ScrollScreen>
  );
}
