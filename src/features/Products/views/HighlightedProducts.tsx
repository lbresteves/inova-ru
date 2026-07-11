import { ThemedText } from "@shared/components";
import { FlatList, View } from "react-native";
import { useLoadHighlightedProducts } from "../hooks/useLoadProducts";
import { IProductView } from "../types/IProduct";
import LoadingIndicator from "./LoadingIndicator";
import ProductCard from "./ProductCard";
import { HighlightedProductsContainer } from "./styles/HighlightedProducts.styled";

const HighlightedProducts = () => {
  const { data, isLoading } = useLoadHighlightedProducts();

  if (isLoading) {
    return (
      <HighlightedProductsContainer center>
        <LoadingIndicator />
        <ThemedText>Loading Products..</ThemedText>
      </HighlightedProductsContainer>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => (item as IProductView).id}
      renderItem={({ item }) => <ProductCard product={item as IProductView} />}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
    />
  );
};

export default HighlightedProducts;
