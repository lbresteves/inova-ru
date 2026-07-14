import type { MenuCategory } from "../types/Meals";

export type RestaurantOption = "setorial1" | "setorial2" | "saude";
export type MealTypeOption = "lunch" | "dinner";

const baseMenus: Record<MealTypeOption, MenuCategory[]> = {
  lunch: [
    { title: "Almoço - Entrada", items: ["Salada de Alface", "Salada de Pepino ao Vinagrete"] },
    {
      title: "Prato Principal",
      items: [
        "Arroz Branco",
        "Feijão Carioca",
        "Frango Xadrez",
        "Soja Refogada com Legumes",
        "Purê de Batata",
        "Molho de Tomate",
      ],
    },
    { title: "Sobremesa", items: ["Doce Tablete", "Refresco"] },
  ],
  dinner: [
    { title: "Jantar - Entrada", items: ["Salada de Repolho", "Tomate ao Vinagrete"] },
    {
      title: "Prato Principal",
      items: ["Arroz Branco", "Feijão", "Carne ao Molho", "Legumes Refogados"],
    },
    { title: "Sobremesa", items: ["Fruta", "Refresco"] },
  ],
};

export function getMenuMock(
  restaurant: RestaurantOption,
  mealType: MealTypeOption,
): MenuCategory[] {
  const restaurantLabel =
    restaurant === "setorial1"
      ? "RU Setorial 1"
      : restaurant === "setorial2"
        ? "RU Setorial 2"
        : "RU Saúde/Direito";

  return baseMenus[mealType].map((category, index) => ({
    ...category,
    title: index === 0 ? `${category.title} · ${restaurantLabel}` : category.title,
  }));
}
