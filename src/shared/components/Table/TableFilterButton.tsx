import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { SelectLabel, SelectTouchable } from "./styles/TableFilterSelect.styled";
import { IconSymbol } from "../IconSymbol/IconSymbol";

export function TableFilterButton({ value, title, onChange }: { value: any; title: string; onChange: (v:any)=>void }) {

    return (
        <>
            <SelectTouchable onPress={() => onChange(!value)} active={false}>
                <SelectLabel active={ false }>{title}</SelectLabel>
            </SelectTouchable>
        </>
    );
}