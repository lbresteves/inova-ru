import type { ListRenderItem } from "react-native";
import { ActivityIndicator, FlatList, View } from "react-native";
import { AppButton } from "../AppButton/AppButton";
import { ThemedText } from "../ThemedText/ThemedText";

interface TableContentProps<TItem> {
  data: TItem[];
  renderItem: ListRenderItem<TItem>;
  keyExtractor: (item: TItem, index: number) => string;
  emptyMessage: string;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isInitialLoading?: boolean;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
}

function TableMessage({
  errorMessage,
  isLoading,
  message,
  onRetry,
}: {
  errorMessage?: string;
  isLoading?: boolean;
  message: string;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ alignItems: "center", gap: 12, padding: 20 }}>
      <ThemedText>{errorMessage ?? message}</ThemedText>
      {errorMessage && onRetry ? (
        <AppButton label="Tentar novamente" onPress={onRetry} variant="outlined" />
      ) : null}
    </View>
  );
}

export function TableContent<TItem>({
  data,
  emptyMessage,
  errorMessage,
  hasNextPage = false,
  isFetchingNextPage = false,
  isInitialLoading = false,
  isRefreshing = false,
  keyExtractor,
  onEndReached,
  onRefresh,
  onRetry,
  renderItem,
}: TableContentProps<TItem>) {
  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          onEndReached?.();
        }
      }}
      onEndReachedThreshold={0.3}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      ListEmptyComponent={
        <TableMessage
          errorMessage={errorMessage}
          isLoading={isInitialLoading}
          message={emptyMessage}
          onRetry={onRetry}
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : null
      }
    />
  );
}
