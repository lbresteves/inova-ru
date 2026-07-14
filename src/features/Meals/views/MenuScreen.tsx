import {
  PageHeader,
  ScreenContent,
  ScrollScreen,
  SelectionModal,
} from "@shared/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  getMenuMock,
  type MealTypeOption,
  type RestaurantOption,
} from "../mocks/mealsMocks";
import {
  Category,
  CategoryTitle,
  Item,
  ItemText,
  MenuContent,
  Selector,
  SelectorText,
  Selectors,
} from "./styles/MenuScreen.styled";

const restaurantOptions: { label: string; value: RestaurantOption }[] = [
  { label: "RU Setorial 1", value: "setorial1" },
  { label: "RU Setorial 2", value: "setorial2" },
  { label: "RU Saúde/Direito", value: "saude" },
];
const mealOptions: { label: string; value: MealTypeOption }[] = [
  { label: "Almoço", value: "lunch" },
  { label: "Jantar", value: "dinner" },
];

export default function MenuScreen() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<RestaurantOption>("setorial1");
  const [mealType, setMealType] = useState<MealTypeOption>("lunch");
  const [openSelector, setOpenSelector] = useState<"restaurant" | "meal" | null>(null);
  const menu = getMenuMock(restaurant, mealType);
  const restaurantLabel = restaurantOptions.find((item) => item.value === restaurant)?.label;
  const mealLabel = mealOptions.find((item) => item.value === mealType)?.label;

  return (
    <ScrollScreen>
      <PageHeader title="Cardápio" onBack={() => router.back()} />
      <ScreenContent>
        <MenuContent>
          <Selectors>
            <Selector
              accessibilityLabel="Selecionar restaurante"
              accessibilityRole="button"
              onPress={() => setOpenSelector("restaurant")}
            >
              <SelectorText>{restaurantLabel} ▾</SelectorText>
            </Selector>
            <Selector
              accessibilityLabel="Selecionar refeição"
              accessibilityRole="button"
              onPress={() => setOpenSelector("meal")}
            >
              <SelectorText>{mealLabel} ▾</SelectorText>
            </Selector>
          </Selectors>
          {menu.map((category) => (
            <Category key={category.title}>
              <CategoryTitle>{category.title}</CategoryTitle>
              {category.items.map((item) => (
                <Item key={item}>
                  <ItemText>{item}</ItemText>
                </Item>
              ))}
            </Category>
          ))}
        </MenuContent>
      </ScreenContent>

      <SelectionModal<RestaurantOption>
        onClose={() => setOpenSelector(null)}
        onSelect={setRestaurant}
        options={restaurantOptions}
        selectedValue={restaurant}
        title="Selecionar restaurante"
        visible={openSelector === "restaurant"}
      />
      <SelectionModal<MealTypeOption>
        onClose={() => setOpenSelector(null)}
        onSelect={setMealType}
        options={mealOptions}
        selectedValue={mealType}
        title="Selecionar refeição"
        visible={openSelector === "meal"}
      />
    </ScrollScreen>
  );
}
