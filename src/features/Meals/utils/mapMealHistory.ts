import type { MealHistoryItem } from "../types/Meals";
import type { MealHistoryResponseDto } from "../types/MealHistoryDto";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
});
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

export function mapMealHistory(dto: MealHistoryResponseDto): MealHistoryItem[] {
  return dto.data.map((item, index) => ({
    amount: item.gratuidade ? "Gratuita" : currencyFormatter.format(item.valor_total),
    date: dateFormatter.format(new Date(item.data_hora)).replace(",", " ·"),
    id: `${item.filial.codigo}-${item.data_hora}-${index}`,
    restaurant: item.filial.nome,
    timestamp: item.data_hora,
  }));
}
