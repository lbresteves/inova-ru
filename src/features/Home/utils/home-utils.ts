import { TIconName } from "@shared/types/TIconName";

export function getBalanceVisibilityLabel(isBalanceVisible: boolean) {
  if (isBalanceVisible) {
    return "Ocultar saldo";
  }

  return "Mostrar saldo";
}

export function getBalanceVisibilityIconName(isBalanceVisible: boolean): TIconName {
  if (isBalanceVisible) {
    return "eye";
  }

  return "eye.slash";
}