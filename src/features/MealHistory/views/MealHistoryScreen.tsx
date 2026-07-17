import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { Container, ItemLeft, ItemLeftSub, ItemLeftTitle, ItemStatusFree, ItemStatusNotFree, Table, TableHeader, TableItem } from "./styles/MealHistory.styled";
import { TableContent } from "@/src/shared/components/Table/TableContent";
import { formatCurrency, formatStatus, formatDate, formatTime } from "../utils/TextFormat";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { TableFilterButton } from "@/src/shared/components/Table/TableFilterButton";
import React, { useState } from "react";
import { fetchRecargas, RecargaFilters } from "../utils/FecthRecargas";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const PERIOD_ALL = 0;
const PERIOD_THIS_MONTH = 1;
const PERIOD_THIS_YEAR = 2;

const PERIOD_OPTIONS = [
    { label: "Período", value: PERIOD_ALL},
    { label: "Este mês", value: PERIOD_THIS_MONTH},
    { label: "Este ano", value: PERIOD_THIS_YEAR},
];

const RU_OPTIONS = [
    { label: "Todos os RUs", value: ""},
    { label: "RU Saúde/Direito", value: "0001"},
    { label: "RU Setorial 2", value: "0002"},
    { label: "RU Setorial 1", value: "0003"},
    { label: "RU ICA", value: "0004"},
    { label: "RU HRTN", value: "0005"},
];

function getPeriodRange(period: number) {
    switch(period) {
        case PERIOD_ALL: return {};
        case PERIOD_THIS_MONTH: {
            var today = new Date();
            const first = new Date(today.getFullYear(), today.getMonth(), 1);
            return {
                dataInicio: first.toISOString().split("T")[0],
                dataFim: today.toISOString().split("T")[0],
            };
        }
        case PERIOD_THIS_YEAR: {
            var today = new Date();
            const first = new Date(today.getFullYear(), 0, 1);
            return {
                dataInicio: first.toISOString().split("T")[0],
                dataFim: today.toISOString().split("T")[0],
            };
        } 
    }
    return {};
}

export default function HistoricoRecargasScreen() {
    const [filters, setFilters] = useState<RecargaFilters>({});
    const [periodPreset, setPeriodPreset] = useState(PERIOD_ALL);
    const [ruPreset, setRuPreset] = useState("");

    const handlePeriodChange = (preset: number) => {
        setPeriodPreset(preset);
        var range = getPeriodRange(preset);
        setFilters((f) => ({ ...f, range }));
    };

    const handleRuChange = (ru: string) => {
        setRuPreset(ru);
        setFilters((f) => ({ ...f, ru }));
    };

    return (
    <>
    <Container>
        <HeaderBack title="Histórico de Refeições" onReturnPress={() => {router.replace("/main/home")}} />
        <Table>
            <TableHeader>
                <TableFilterSelect 
                    value={periodPreset} 
                    defaultValue={PERIOD_ALL} 
                    options={PERIOD_OPTIONS} 
                    onChange={(period: number) => handlePeriodChange(period)} 
                    />
                <TableFilterSelect 
                    value={ruPreset} 
                    defaultValue=""
                    options={RU_OPTIONS} 
                    onChange={(ru: string) => handleRuChange(ru)} 
                    />
            </TableHeader>
            <TableContent 
                filters={filters}
                keyExtractor={(item) => `${item.data_hora}`}
                fetchData={fetchRecargas} 
                renderItem={({item}) => (
                    <TableItem>
                        <ItemLeft>
                            <ItemLeftTitle>{RU_OPTIONS.find(ru => ru.value === item.filial.codigo)?.label}</ItemLeftTitle>
                            <ItemLeftSub>{formatDate(item.data_hora)} · {formatTime(item.data_hora)}</ItemLeftSub>
                        </ItemLeft>
                        {item.gratuidade ? (
                            <ItemStatusFree>Gratuita</ItemStatusFree>
                        ) : (
                            <ItemStatusNotFree>{formatCurrency(item.valor_total)}</ItemStatusNotFree>
                        )}
                    </TableItem>
                )}
            />
        </Table>
    </Container>
    </>
    );
}