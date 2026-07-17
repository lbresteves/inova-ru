import { mock } from "../utils/mock";

export interface RecargaFilters {
    dataInicio?: string,
    dataFim?: string
}

const allMockItems = mock.flatMap((page) => page.data);
const MOCK_PAGE_SIZE = 5;

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// TODO: trocar filtro do mock pela api e adicionar cache
export async function fetchRecargas(page: number, filters: RecargaFilters) {
    const filtered = allMockItems.filter((item) => {
        if(filters.dataInicio && filters.dataFim) {
            const itemDate = new Date(item.data_hora);;
            const start = parseLocalDate(filters.dataInicio);
            const end = parseLocalDate(filters.dataFim);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return itemDate >= start && itemDate <= end;
        }
        return true;
    });

    const start = (page - 1) * MOCK_PAGE_SIZE;
    const end = start + MOCK_PAGE_SIZE;
    return filtered.slice(start, end);
}