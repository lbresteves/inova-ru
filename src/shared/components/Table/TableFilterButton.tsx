import { SelectLabel, SelectTouchable } from "./styles/TableFilterSelect.styled";

type TableFilterButtonProps = {
    value: boolean;
    title: string;
    onChange: (value: boolean) => void;
};

export function TableFilterButton({ value, title, onChange }: TableFilterButtonProps) {

    return (
        <>
            <SelectTouchable onPress={() => onChange(!value)} active={value}>
                <SelectLabel active={value}>{title}</SelectLabel>
            </SelectTouchable>
        </>
    );
}
