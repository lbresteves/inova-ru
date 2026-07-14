import type { BalanceDto } from "../types/BalanceDto";
import type { HomeSummary } from "../types/HomeSummary";

function toDisplayName(value: string) {
  const firstName = value.trim().split(/\s+/)[0]?.toLocaleLowerCase("pt-BR") ?? "Usuário";
  return firstName.charAt(0).toLocaleUpperCase("pt-BR") + firstName.slice(1);
}

export function mapBalanceDto(dto: BalanceDto): HomeSummary {
  return {
    balance: dto.saldo.credito_disponivel,
    fullName: dto.consumidor.nome,
    name: toDisplayName(dto.consumidor.nome),
    rechargeLimit: dto.saldo.limite_recarga,
    status: dto.consumidor.situacao === "A" ? "Ativo" : "Inativo",
  };
}
