import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, ListRenderItem, View } from "react-native";
import { ThemedText } from "../ThemedText/ThemedText";

interface TableContentProps<F> {
    renderItem: ListRenderItem<any>;
    fetchData: (page: number, filters: F) => Promise<any[]>;
    keyExtractor?: (item: any, index: number) => string;
    filters: F;
}

export function TableContent<F>({ renderItem, fetchData, keyExtractor, filters }: TableContentProps<F>) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const pageRef = useRef<number>(1);
    const loadingRef = useRef(false); // espelha 'loading' pra uso em callbacks sem depender de closure desatualizada
    const hasMoreRef = useRef(true);
    // guarda a altura do container e do conteúdo pra saber se a lista "encheu" a tela
    const containerHeightRef = useRef(0);
    const contentHeightRef = useRef(0);
    const filtersRef = useRef(filters);

    const fetchMoreData = useCallback(async () => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        const page = pageRef.current;
        
        try {
            console.log("Fetching data for page:", page);
            const newData = await fetchData(page, filtersRef.current);

            if (newData.length > 0) {
                setData((prevData) => [...prevData, ...newData]);
                pageRef.current = page + 1;
            } else {
                hasMoreRef.current = false;
            }
        } catch (err) {
            console.error("fetchMoreData error:", err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [fetchData]);

    const checkIfShouldFetchMore = useCallback(() => {
        if (
            contentHeightRef.current > 0 &&
            containerHeightRef.current > 0 &&
            contentHeightRef.current <= containerHeightRef.current &&
            hasMoreRef.current &&
            !loadingRef.current
        ) {
            fetchMoreData();
        }
    }, [fetchMoreData]);

    const handleLayout = (e: any) => {
        console.log("handleLayout:");
        containerHeightRef.current = e.nativeEvent.layout.height;
        checkIfShouldFetchMore();
    };

    const handleContentSizeChange = (_width: number, height: number) => {
        console.log("handleContentSizeChange:");
        contentHeightRef.current = height;
        checkIfShouldFetchMore();
    };

    // Sempre que os filtros mudarem (não importa o que há dentro deles),
    // os dados acumulados ficam inválidos: reinicia a paginação do zero.
    useEffect(() => {
        console.log("Fetched:");
        filtersRef.current = filters;
        pageRef.current = 1;
        hasMoreRef.current = true;
        contentHeightRef.current = 0; // força reavaliação com o próximo onContentSizeChange
        setData([]);
        fetchMoreData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    return (
        <FlatList 
            key={JSON.stringify(filters)}  // força remontagem a cada mudança de filtro
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor ?? ((item, index) => item?.id?.toString() ?? index.toString())}
            onLayout={handleLayout}
            onContentSizeChange={handleContentSizeChange}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />} // gap vertical 12
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
                loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : <ThemedText>Nenhuma recarga encontrada.</ThemedText>
            }
            ListFooterComponent={
                loading && data.length > 0 ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
            }
        />
    );
}