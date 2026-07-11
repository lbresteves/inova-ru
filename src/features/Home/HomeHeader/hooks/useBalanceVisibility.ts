import { useState } from "react";

export function useBalanceVisibility() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  function toggleBalanceVisibility() {
    setIsBalanceVisible((isVisible) => !isVisible);
  }

  return {
    isBalanceVisible,
    toggleBalanceVisibility,
  };
}
