import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";

import {
  ModalBackdrop,
  ModalRoot,
  TimeInputButton,
  TimeInputText,
  TimeSeparator,
  WheelActionText,
  WheelColumn,
  WheelColumns,
  WheelHeader,
  WheelItem,
  WheelItemText,
  WheelSelectionMarker,
  WheelSheet,
  WheelTitle,
  WHEEL_ITEM_HEIGHT,
} from "./TimeWheelInput.styled";

export interface TimeWheelValue {
  hour: number;
  minute: number;
}

export interface TimeWheelInputProps {
  accessibilityLabel?: string;
  disabled?: boolean;
  minuteInterval?: number;
  value: TimeWheelValue;
  onChange: (value: TimeWheelValue) => void;
}

function getTwoDigits(value: number) {
  return value.toString().padStart(2, "0");
}

function getScrollIndex(
  event: NativeSyntheticEvent<NativeScrollEvent>,
  values: number[]
) {
  const index = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
  return Math.max(0, Math.min(index, values.length - 1));
}

function WheelNumberItem({
  item,
  selectedValue,
}: {
  item: number;
  selectedValue: number;
}) {
  const selected = item === selectedValue;

  return (
    <WheelItem selected={selected}>
      <WheelItemText selected={selected}>{getTwoDigits(item)}</WheelItemText>
    </WheelItem>
  );
}

export function TimeWheelInput({
  accessibilityLabel = "Selecionar horário",
  disabled,
  minuteInterval = 1,
  value,
  onChange,
}: TimeWheelInputProps) {
  const hourListRef = useRef<FlatList<number>>(null);
  const minuteListRef = useRef<FlatList<number>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftHour, setDraftHour] = useState(value.hour);
  const [draftMinute, setDraftMinute] = useState(value.minute);

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, index) => index),
    []
  );
  const minutes = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(60 / minuteInterval) },
        (_, index) => index * minuteInterval
      ).filter((minute) => minute < 60),
    [minuteInterval]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const minuteIndex = Math.max(0, minutes.indexOf(value.minute));

    requestAnimationFrame(() => {
      hourListRef.current?.scrollToIndex({
        animated: false,
        index: value.hour,
      });
      minuteListRef.current?.scrollToIndex({
        animated: false,
        index: minuteIndex,
      });
    });
  }, [isOpen, minutes, value.hour, value.minute]);

  function openPicker() {
    if (disabled) {
      return;
    }

    setDraftHour(value.hour);
    setDraftMinute(value.minute);
    setIsOpen(true);
  }

  function closePicker() {
    setIsOpen(false);
  }

  function confirmTime() {
    onChange({ hour: draftHour, minute: draftMinute });
    closePicker();
  }

  const timeText = `${getTwoDigits(value.hour)}:${getTwoDigits(value.minute)}`;

  return (
    <>
      <TimeInputButton
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        activeOpacity={disabled ? 1 : 0.82}
        disabled={disabled}
        onPress={openPicker}
      >
        <TimeInputText disabled={disabled}>{timeText}</TimeInputText>
      </TimeInputButton>

      <Modal
        animationType="fade"
        onRequestClose={closePicker}
        transparent
        visible={isOpen}
      >
        <ModalRoot>
          <ModalBackdrop onPress={closePicker} />
          <WheelSheet>
            <WheelHeader>
              <TouchableOpacity
                accessibilityLabel="Cancelar seleção de horário"
                accessibilityRole="button"
                activeOpacity={0.75}
                onPress={closePicker}
              >
                <WheelActionText>Cancelar</WheelActionText>
              </TouchableOpacity>
              <WheelTitle>Horário</WheelTitle>
              <TouchableOpacity
                accessibilityLabel="Confirmar horário"
                accessibilityRole="button"
                activeOpacity={0.75}
                onPress={confirmTime}
              >
                <WheelActionText primary>OK</WheelActionText>
              </TouchableOpacity>
            </WheelHeader>

            <WheelColumns>
              <WheelColumn>
                <WheelSelectionMarker pointerEvents="none" />
                <FlatList
                  ref={hourListRef}
                  data={hours}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({
                    index,
                    length: WHEEL_ITEM_HEIGHT,
                    offset: WHEEL_ITEM_HEIGHT * index,
                  })}
                  keyExtractor={(item) => `hour-${item}`}
                  renderItem={({ item }) => (
                    <WheelNumberItem item={item} selectedValue={draftHour} />
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={WHEEL_ITEM_HEIGHT}
                  onMomentumScrollEnd={(event) => {
                    setDraftHour(hours[getScrollIndex(event, hours)]);
                  }}
                  contentContainerStyle={{
                    paddingVertical: WHEEL_ITEM_HEIGHT * 2,
                  }}
                />
              </WheelColumn>

              <TimeSeparator>:</TimeSeparator>

              <WheelColumn>
                <WheelSelectionMarker pointerEvents="none" />
                <FlatList
                  ref={minuteListRef}
                  data={minutes}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({
                    index,
                    length: WHEEL_ITEM_HEIGHT,
                    offset: WHEEL_ITEM_HEIGHT * index,
                  })}
                  keyExtractor={(item) => `minute-${item}`}
                  renderItem={({ item }) => (
                    <WheelNumberItem item={item} selectedValue={draftMinute} />
                  )}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={WHEEL_ITEM_HEIGHT}
                  onMomentumScrollEnd={(event) => {
                    setDraftMinute(minutes[getScrollIndex(event, minutes)]);
                  }}
                  contentContainerStyle={{
                    paddingVertical: WHEEL_ITEM_HEIGHT * 2,
                  }}
                />
              </WheelColumn>
            </WheelColumns>
          </WheelSheet>
        </ModalRoot>
      </Modal>
    </>
  );
}
