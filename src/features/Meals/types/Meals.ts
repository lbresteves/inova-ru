export type MealHistoryItem = {
  id: string;
  restaurant: string;
  date: string;
  amount: string;
  timestamp?: string;
};

export type MenuCategory = {
  title: string;
  items: string[];
};
