import { useTheme } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { ThemedText } from "@shared/components";

type PaymentQrCodeProps = {
  qrCodeUri: string;
};

function buildQrCanvasHtml(qrCodeUri: string, primaryColor: string): string {
  const source = JSON.stringify(qrCodeUri);
  const color = JSON.stringify(primaryColor);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <style>
    html, body { width: 100%; height: 100%; margin: 0; background: transparent; overflow: hidden; }
    body { display: flex; align-items: center; justify-content: center; }
    canvas { width: 180px; height: 180px; display: block; background: transparent; image-rendering: pixelated; }
  </style>
</head>
<body>
  <canvas id="qr" width="180" height="180" aria-label="QR Code PIX"></canvas>
  <script>
    (function () {
      const source = ${source};
      const primary = ${color};
      const output = document.getElementById("qr");
      const outputContext = output.getContext("2d", { alpha: true });

      function post(value) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(value);
        }
      }

      function parseHex(hex) {
        const normalized = hex.replace("#", "");
        if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
          return { r: 0, g: 103, b: 95 };
        }
        return {
          r: parseInt(normalized.slice(0, 2), 16),
          g: parseInt(normalized.slice(2, 4), 16),
          b: parseInt(normalized.slice(4, 6), 16),
        };
      }

      const target = parseHex(primary);
      const image = new Image();
      image.onload = function () {
        try {
          const sourceCanvas = document.createElement("canvas");
          sourceCanvas.width = image.naturalWidth || image.width;
          sourceCanvas.height = image.naturalHeight || image.height;
          const sourceContext = sourceCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
          sourceContext.imageSmoothingEnabled = false;
          sourceContext.drawImage(image, 0, 0);

          const pixels = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
          for (let index = 0; index < pixels.data.length; index += 4) {
            const red = pixels.data[index];
            const green = pixels.data[index + 1];
            const blue = pixels.data[index + 2];
            const sourceAlpha = pixels.data[index + 3];
            const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

            pixels.data[index] = target.r;
            pixels.data[index + 1] = target.g;
            pixels.data[index + 2] = target.b;

            if (luminance >= 224 || sourceAlpha === 0) {
              pixels.data[index + 3] = 0;
            } else if (luminance <= 96) {
              pixels.data[index + 3] = sourceAlpha;
            } else {
              const coverage = Math.max(0, Math.min(1, (224 - luminance) / 128));
              pixels.data[index + 3] = Math.round(sourceAlpha * coverage);
            }
          }

          sourceContext.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
          sourceContext.putImageData(pixels, 0, 0);
          outputContext.clearRect(0, 0, output.width, output.height);
          outputContext.imageSmoothingEnabled = false;
          outputContext.drawImage(sourceCanvas, 0, 0, output.width, output.height);
          post("ready");
        } catch (error) {
          post("error");
        }
      };
      image.onerror = function () { post("error"); };
      image.src = source;
    })();
  </script>
</body>
</html>`;
}

export function PaymentQrCode({ qrCodeUri }: PaymentQrCodeProps) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const html = useMemo(
    () => buildQrCanvasHtml(qrCodeUri, theme.colors.primary),
    [qrCodeUri, theme.colors.primary],
  );

  useEffect(() => {
    setFailed(false);
  }, [qrCodeUri]);

  function handleMessage(event: WebViewMessageEvent) {
    if (event.nativeEvent.data === "error") {
      setFailed(true);
    }
  }

  if (failed) {
    return (
      <ThemedText style={styles.errorText}>
        QR Code indisponível. Use o código PIX copia e cola.
      </ThemedText>
    );
  }

  return (
    <WebView
      accessibilityLabel="QR Code PIX"
      javaScriptEnabled
      onError={() => setFailed(true)}
      onHttpError={() => setFailed(true)}
      onMessage={handleMessage}
      originWhitelist={["*"]}
      scrollEnabled={false}
      setSupportMultipleWindows={false}
      source={{ html }}
      style={styles.webView}
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
  webView: {
    backgroundColor: "transparent",
    height: 180,
    width: 180,
  },
});
