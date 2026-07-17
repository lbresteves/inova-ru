import { HeaderBack } from "@/src/shared/components/HeaderBack/HeaderBack";
import { Container, ItemLeft, ItemLeftSub, ItemLeftTitle, ItemStatusApproved, ItemStatusExpired, Table, TableHeader, TableItem } from "./styles/RechargeHistory.styled";
import { TableContent } from "@/src/shared/components/Table/TableContent";
import { mock } from "../utils/mock";
import { formatDateTime, formatCurrency, formatStatus } from "../utils/TextFormat";
import { TableFilterSelect } from "@/src/shared/components/Table/TableFilterSelect";
import { TableFilterButton } from "@/src/shared/components/Table/TableFilterButton";
import React, { useState } from "react";

// ISO date, ex: "2026-07-01"
interface RecargaFilters {
    dataInicio?: string,
    dataFim?: string
}

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

// "achata" todas as páginas mockadas num único dataset —
// simula o banco de dados completo que uma API de verdade consultaria
export const allMockItems = mock.flatMap((page) => page.data);

export const MOCK_PAGE_SIZE = 5; // mesmo tamanho de página que seu mock já usa

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d); // cria meia-noite LOCAL
}

// fetchData agora recebe os filtros e é quem sabe aplicá-los.
// Hoje filtra o mock; no futuro, filtra a leitura do cache local
// e dispara/mescla o request de atualização à API com os mesmos critérios.
async function fetchRecargas(page: number, filters: RecargaFilters) {
    if(filters.dataInicio && filters.dataFim) {
    }const filtered = allMockItems.filter((item) => {
        if(filters.dataInicio && filters.dataFim) {
            const itemDate = new Date(item.data_hora);;
            const start = parseLocalDate(filters.dataInicio);
            const end = parseLocalDate(filters.dataFim);
            start.setHours(0, 0, 0, 0); // inclui o exato inicio da dataInicio
            end.setHours(23, 59, 59, 999); // inclui o dia inteiro de dataFim
            return itemDate >= start && itemDate <= end;
        }
        return true;
    });

    const start = (page - 1) * MOCK_PAGE_SIZE;
    const end = start + MOCK_PAGE_SIZE;
    return filtered.slice(start, end);
}

export default function HistoricoRecargasScreen() {
    const [filters, setFilters] = useState<RecargaFilters>({});
    const [periodPreset, setPeriodPreset] = useState(PERIOD_ALL);
    const [thisMonthPreset, setThisMonthPreset] = useState(false);

    const handlePeriodChange = (preset: number) => {
        setPeriodPreset(preset);
        var range = getPeriodRange(preset);
        setFilters(range);

        var selectedOption = PERIOD_OPTIONS.find(p => p.value === preset);
        if(selectedOption) {
            if(selectedOption.value === PERIOD_THIS_MONTH)
                setThisMonthPreset(true);
            else
                setThisMonthPreset(false);
        }
    };

    const handleThisMonthToggle = (active: boolean) => {
        if (active) {
            // seta para Este mês
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
        <HeaderBack title="Histórico de Recargas" onReturnPress={() => {console.log("Back pressed")}} />
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