import { Modal } from "react-native";
import { IconSymbol } from "../IconSymbol/IconSymbol";
import {
  Backdrop,
  CloseButton,
  ModalCard,
  ModalTitle,
  OptionButton,
  OptionText,
} from "./SelectionModal.styled";

export type SelectionOption<T extends string> = {
  label: string;
  value: T;
};

export function SelectionModal<T extends string>({
  onClose,
  onSelect,
  options,
  selectedValue,
  title,
  visible,
}: {
  onClose: () => void;
  onSelect: (value: T) => void;
  options: SelectionOption<T>[];
  selectedValue: T;
  title: string;
  visible: boolean;
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Backdrop accessibilityViewIsModal>
        <ModalCard>
          <ModalTitle>{title}</ModalTitle>
          {options.map((option) => {
            const selected = option.value === selectedValue;
            return (
              <OptionButton
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                selected={selected}
              >
                <OptionText selected={selected}>{option.label}</OptionText>
                {selected ? <IconSymbol color="primary" name="checkmark" size={20} /> : null}
              </OptionButton>
            );
          })}
          <CloseButton accessibilityRole="button" onPress={onClose}>
            <OptionText selected={false}>Fechar</OptionText>
          </CloseButton>
        </ModalCard>
      </Backdrop>
    </Modal>
  );
}
