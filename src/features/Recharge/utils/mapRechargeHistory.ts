import type { RechargeHistoryResponseDto } from "../types/RechargeHistoryDto";
import type { RechargeHistoryItem } from "../types/Recharge";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

export function mapRechargeHistory(
  dto: RechargeHistoryResponseDto,
): RechargeHistoryItem[] {
  return dto.data.map((item, index) => ({
    amount: currencyFormatter.format(item.valor_total),
    date: `PIX · ${dateFormatter.format(new Date(item.data_hora)).replace(",", "")}`,
    id: `${item.data_hora}-${index}`,
    status: "Aprovado",
    timestamp: item.data_hora,
  }));
}
