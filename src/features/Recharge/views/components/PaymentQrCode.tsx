import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@shared/components";

type PaymentQrCodeProps = {
  qrCodeUri: string;
};

export function PaymentQrCode({ qrCodeUri }: PaymentQrCodeProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <ThemedText style={styles.errorText}>
        QR Code indisponível. Use o código PIX copia e cola.
      </ThemedText>
    );
  }

  return (
    <Image
      accessibilityLabel="QR Code PIX"
      contentFit="contain"
      onError={() => setFailed(true)}
      source={{ uri: qrCodeUri }}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    padding: 16,
    textAlign: "center",
  },
  image: {
    backgroundColor: "white",
    height: 180,
    width: 180,
  },
});
