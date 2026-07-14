import { AppButton, QueryStateView } from "@shared/components";
import { useSessionStore } from "@shared/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useHomeSummaryQuery } from "../hooks/useHomeSummaryQuery";
import { HomeActionCard } from "./components/HomeActionCard";
import { HomeDrawer, type DrawerDestination } from "./components/HomeDrawer";
import { HomeHeader } from "./components/HomeHeader";
import { CardGroup, Content, HomeScroll, Root } from "./styles/HomeScreen.styled";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((state) => state.clearSession);
  const sessionToken = useSessionStore((state) => state.token);
  const summaryQuery = useHomeSummaryQuery();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!sessionToken) {
      router.replace("/auth/login");
    }
  }, [router, sessionToken]);

  function navigate(destination: DrawerDestination) {
    const routes: Record<Exclude<DrawerDestination, "logout">, string> = {
      recharge: "/recharge",
      rechargeHistory: "/recharge/history",
      mealHistory: "/meals/history",
      menu: "/meals/menu",
      settings: "/settings",
    };
    if (destination === "logout") {
      clearSession();
      queryClient.clear();
      router.replace("/auth/login");
      return;
    }
    router.push(routes[destination] as never);
  }

  if (summaryQuery.isPending) {
    return (
      <QueryStateView
        message="Consultando seu saldo e seus dados institucionais."
        title="Carregando…"
      />
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <QueryStateView
        message="Não foi possível carregar seu saldo. Verifique o Mockoon e tente novamente."
        onAction={() => summaryQuery.refetch()}
        title="Não foi possível abrir o início"
      />
    );
  }

  return (
    <Root>
      <StatusBar style="light" />
      <HomeScroll contentContainerStyle={{ flexGrow: 1 }}>
        <HomeHeader
          balance={formatCurrency(summaryQuery.data.balance)}
          name={summaryQuery.data.name}
          onHelpPress={() => router.push("/about")}
          onMenuPress={() => setDrawerOpen(true)}
          onNotificationsPress={() => router.push("/settings")}
          status={summaryQuery.data.status}
        />
        <Content>
          <AppButton label="Recarregar créditos" onPress={() => router.push("/recharge")} />
          <CardGroup>
            <HomeActionCard
              description="Ver recargas via PIX"
              icon="clock.arrow.circlepath"
              onPress={() => router.push("/recharge/history")}
              title="Histórico de recargas"
            />
            <HomeActionCard
              description="Consumos nos RUs"
              icon="fork.knife"
              onPress={() => router.push("/meals/history")}
              title="Histórico de refeições"
            />
          </CardGroup>
        </Content>
      </HomeScroll>
      <HomeDrawer
        onClose={() => setDrawerOpen(false)}
        onNavigate={navigate}
        visible={drawerOpen}
      />
    </Root>
  );
}
