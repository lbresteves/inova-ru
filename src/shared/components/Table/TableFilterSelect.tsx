import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { SelectLabel, SelectTouchable } from "./styles/TableFilterSelect.styled";
import { IconSymbol } from "../IconSymbol/IconSymbol";

export function TableFilterSelect({ value, defaultValue, options, onChange }: { value: any; defaultValue: any; options: any[], onChange: (v:any)=>void }) {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find(o => o.value === value)?.label ?? defaultValue;

    return (
        <>
            <SelectTouchable onPress={() => setOpen(true)} active={value !== defaultValue}>
                <SelectLabel active={ value !== defaultValue }>{selectedLabel}</SelectLabel>
                <IconSymbol color={value !== defaultValue ? "activeIconColor" : "unactiveIconColor"} name="chevron.down"></IconSymbol>
            </SelectTouchable>
            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity style={{flex:1}} onPress={() => setOpen(false)} activeOpacity={1}>
                <View style={{ margin:40, backgroundColor:"#fff", borderRadius:8, maxHeight:"70%" }}>
                    <FlatList
                    data={options}
                    keyExtractor={(o)=>o.value}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => { onChange(item.value); setOpen(false); }} style={{ padding:16 }}>
                        <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                    />
                </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}