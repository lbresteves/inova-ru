import { BoxContent } from "@shared/components";
import { View } from "react-native";
import { useLoadProducts } from "../hooks/useLoadProducts";
import { IProductView } from "../types/IProduct";
import LoadingIndicator from "./LoadingIndicator";
import ProductCard from "./ProductCard";
import { List } from "./styles/ProductList.styled";

const ProductList = () => {
  const { data, isLoading } = useLoadProducts();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!data) {
    return null;
  }

  return (
    <BoxContent>
      <List
        data={data}
        keyExtractor={(item) => (item as IProductView).id.toString()}
        renderItem={({ item }) => (
          <ProductCard full product={item as IProductView} />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </BoxContent>
  );
};

export default ProductList;
