import { useTheme } from "@emotion/react";
import { BoxContent, IconButton, ThemedText } from "@shared/components";
import { useProductsAction, useProductsState } from "../hooks/useProductsSlice";
import { IProductView } from "../types/IProduct";
import { Card, CardImage, CardImageWrapper } from "./styles/ProductCard.styled";

export interface IProductCardProps extends React.ComponentProps<typeof Card> {
  product: IProductView;
}

const ProductCard = ({ product, full }: IProductCardProps) => {
  const theme = useTheme();

  const addFavoriteProduct = useProductsAction("addFavoriteProduct");

  const removeFavoriteProduct = useProductsAction("removeFavoriteProduct");

  const favoriteProducts = useProductsState("favoriteProducts");

  const isFavorite = favoriteProducts.includes(product.id);

  const handlePress = () => {
    if (isFavorite) {
      removeFavoriteProduct(product.id);
    } else {
      addFavoriteProduct(product.id);
    }
  };

  return (
    <Card full={full}>
      <CardImageWrapper>
        <CardImage source={{ uri: product.image?.filePath }} />
      </CardImageWrapper>
      <BoxContent center padding={8} flex={1} bg="transparent">
        <BoxContent bg="transparent">
          <ThemedText>{product.name}</ThemedText>
        </BoxContent>
        <BoxContent
          bg="transparent"
          justifyContent="space-between"
          flexDirection="row"
          center
        >
          <ThemedText>{product.price}</ThemedText>
          <IconButton
            onPress={handlePress}
            size={24}
            name={isFavorite ? "heart.fill" : "heart"}
            color={theme.colors.primary}
          />
        </BoxContent>
      </BoxContent>
    </Card>
  );
};

export default ProductCard;
