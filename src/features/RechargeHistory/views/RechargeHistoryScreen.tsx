import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { Container, ItemLeft, ItemLeftSub, ItemLeftTitle, ItemStatusApproved, ItemStatusExpired, Table, TableHeader, TableItem } from "./styles/RechargeHistory.styled";
import { TableContent } from "@/src/shared/components/Table/TableContent";
import { formatDateTime, formatCurrency, formatStatus } from "../utils/TextFormat";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { TableFilterButton } from "@/src/shared/components/Table/TableFilterButton";
import React, { useState } from "react";
import { fetchRecargas, RecargaFilters } from "../utils/FecthRecargas";
import { router } from "expo-router";

const PERIOD_ALL = 0;
const PERIOD_THIS_MONTH = 1;
const PERIOD_THIS_YEAR = 2;

const PERIOD_OPTIONS = [
    { label: "Período", value: PERIOD_ALL},
    { label: "Este mês", value: PERIOD_THIS_MONTH},
    { label: "Este ano", value: PERIOD_THIS_YEAR},
];

function getPeriodRange(period: number) {
    switch(period) {
        case PERIOD_ALL: return {};
        case PERIOD_THIS_MONTH: {
            const today = new Date();
            const first = new Date(today.getFullYear(), today.getMonth(), 1);
            return {
                dataInicio: first.toISOString().split("T")[0],
                dataFim: today.toISOString().split("T")[0],
            };
        }
        case PERIOD_THIS_YEAR: {
            const today = new Date();
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
    const [thisMonthPreset, setThisMonthPreset] = useState(false);

    const handlePeriodChange = (preset: number) => {
        setPeriodPreset(preset);
        const range = getPeriodRange(preset);
        setFilters(range);

        const selectedOption = PERIOD_OPTIONS.find(p => p.value === preset);
        if(selectedOption) {
            if(selectedOption.value === PERIOD_THIS_MONTH)
                setThisMonthPreset(true);
            else
                setThisMonthPreset(false);
        }
    };

    const handleThisMonthToggle = (active: boolean) => {
        if (active) {
            setPeriodPreset(PERIOD_THIS_MONTH);
            setFilters(getPeriodRange(PERIOD_THIS_MONTH));
        } else {
            setPeriodPreset(PERIOD_ALL);
            setFilters({});
        }
    };

    return (
    <>
    <Container>
        <HeaderBack title="Histórico de Recargas" onReturnPress={() => {router.replace("/main/home")}} />
        <Table>
            <TableHeader>
                <TableFilterSelect
                    value={periodPreset}
                    defaultValue={PERIOD_ALL}
                    options={PERIOD_OPTIONS}
                    onChange={(period: number) => handlePeriodChange(period)}
                />
                <TableFilterButton
                    value={thisMonthPreset}
                    onChange={(thisMonth: boolean) => handleThisMonthToggle(thisMonth)}
                    title="Este mês"
                />
            </TableHeader>
            <TableContent
                filters={filters}
                keyExtractor={(item) => `${item.id}`}
                fetchData={fetchRecargas}
                renderItem={({item}) => (
                    <TableItem>
                        <ItemLeft>
                            <ItemLeftTitle>{formatCurrency(item.valor)}</ItemLeftTitle>
                            <ItemLeftSub>{item.metodo.toUpperCase()} · {formatDateTime(item.data_hora)}</ItemLeftSub>
                        </ItemLeft>
                        {item.status === "aprovado" ? (
                            <ItemStatusApproved>{formatStatus(item.status)}</ItemStatusApproved>
                        ) : (
                            <ItemStatusExpired>{formatStatus(item.status)}</ItemStatusExpired>
                        )}
                    </TableItem>
                )}
            />
        </Table>
    </Container>
    </>
    );
}
