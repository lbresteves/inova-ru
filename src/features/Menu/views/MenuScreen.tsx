import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { router } from "expo-router";
import {
  Container, Table, TableHeader, RUCard, RUCardTitle, SectionBlock, SectionTitle, DishChip,
} from "./styles/Menu.styled";
import { fetchCardapio, CardapioFilters, CardapioItem } from "../utils/FecthCardapio";
import { ThemedText } from "@/src/shared/components";

const MEAL_OPTIONS = [
  { label: "Almoço", value: "almoco" },
  { label: "Jantar", value: "jantar" },
];
const MEAL_LABELS: Record<string, string> = { almoco: "Almoço", jantar: "Jantar" };

const RU_OPTIONS = [
  { label: "Todos os RUs", value: "" },
  { label: "RU Saúde/Direito", value: "0001" },
  { label: "RU Setorial 2", value: "0002" },
  { label: "RU Setorial 1", value: "0003" },
  { label: "RU ICA", value: "0004" },
  { label: "RU HRTN", value: "0005" },
];

const MENU_SECTIONS: {
  key: keyof Pick<CardapioItem, "entrada" | "prato_principal" | "sobremesa">;
  label: (refeicao: string) => string;
}[] = [
  { key: "entrada", label: (refeicao) => `${MEAL_LABELS[refeicao] ?? refeicao} – Entrada` },
  { key: "prato_principal", label: () => "Prato Principal" },
  { key: "sobremesa", label: () => "Sobremesa" },
];

export default function MenuScreen() {
  const [filters, setFilters] = useState<CardapioFilters>({ refeicao: "almoco" });
  const [mealPreset, setMealPreset] = useState("almoco");
  const [ruPreset, setRuPreset] = useState("");
  const [items, setItems] = useState<CardapioItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCardapio(filters).then((result) => {
      if (active) {
        setItems(result);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [JSON.stringify(filters)]);

  const handleMealChange = (refeicao: string) => {
    setMealPreset(refeicao);
    setFilters((f) => ({ ...f, refeicao }));
  };

  const handleRuChange = (codigoRU: string) => {
    setRuPreset(codigoRU);
    setFilters((f) => ({ ...f, codigoRU: codigoRU || undefined }));
  };

  return (
    <Container>
      <HeaderBack title="Cardápio" onReturnPress={() => router.replace("/main/home")} />
      <Table>
        <TableHeader>
          <TableFilterSelect value={ruPreset} defaultValue="" options={RU_OPTIONS} onChange={handleRuChange} />
          <TableFilterSelect value={mealPreset} defaultValue="almoco" options={MEAL_OPTIONS} onChange={handleMealChange} />
        </TableHeader>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : items.length === 0 ? (
          <ThemedText style={{ textAlign: "center", marginTop: 24 }}>
            Nenhum cardápio encontrado para esse filtro.
          </ThemedText>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {items.map((item) => (
              <RUCard key={item.filial.codigo}>
                {!ruPreset && <RUCardTitle>{item.filial.nome}</RUCardTitle>}

                {MENU_SECTIONS.map(({ key, label }) => (
                  <SectionBlock key={key}>
                    <SectionTitle>{label(item.refeicao)}</SectionTitle>
                    {item[key].map((dish) => (
                      <DishChip key={dish}>{dish}</DishChip>
                    ))}
                  </SectionBlock>
                ))}
              </RUCard>
            ))}
          </ScrollView>
        )}
      </Table>
    </Container>
  );
}