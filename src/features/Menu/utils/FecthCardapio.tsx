import { mock } from "./mock";

export interface CardapioFilters {
  refeicao?: string;
  codigoRU?: string;
}

export interface CardapioItem {
  filial: { codigo: string; nome: string };
  refeicao: string;
  entrada: string[];
  prato_principal: string[];
  sobremesa: string[];
}

const allMockItems: CardapioItem[] = mock.flatMap((page) => page.data);

export async function fetchCardapio(filters: CardapioFilters): Promise<CardapioItem[]> {
  return allMockItems.filter((item) => {
    if (filters.refeicao && item.refeicao !== filters.refeicao) return false;
    if (filters.codigoRU && item.filial.codigo !== filters.codigoRU) return false;
    return true;
  });
}