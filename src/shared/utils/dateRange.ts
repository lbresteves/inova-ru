export type DateRangeFilter = {
  dataInicio?: string;
  dataFim?: string;
};

export const PERIOD_ALL = 0;
export const PERIOD_THIS_MONTH = 1;
export const PERIOD_THIS_YEAR = 2;

export const PERIOD_OPTIONS = [
  { label: "Período", value: PERIOD_ALL },
  { label: "Este mês", value: PERIOD_THIS_MONTH },
  { label: "Este ano", value: PERIOD_THIS_YEAR },
];

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPeriodRange(period: number, today = new Date()): DateRangeFilter {
  switch (period) {
    case PERIOD_THIS_MONTH:
      return {
        dataFim: formatLocalDate(today),
        dataInicio: formatLocalDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      };
    case PERIOD_THIS_YEAR:
      return {
        dataFim: formatLocalDate(today),
        dataInicio: formatLocalDate(new Date(today.getFullYear(), 0, 1)),
      };
    case PERIOD_ALL:
    default:
      return {};
  }
}
