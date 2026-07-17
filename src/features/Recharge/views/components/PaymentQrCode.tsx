import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type PaymentQrCodeProps = {
  color: string;
  qrCodeUri: string;
};

function createQrHtml(qrCodeUri: string, color: string): string {
  const serializedUri = JSON.stringify(qrCodeUri);
  const serializedColor = JSON.stringify(color);

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        background: transparent;
        height: 100%;
        margin: 0;
        overflow: hidden;
        width: 100%;
      }

      body {
        align-items: center;
        display: flex;
        justify-content: center;
      }

      canvas {
        display: block;
        height: 100%;
        image-rendering: pixelated;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <canvas id="qr"></canvas>
    <script>
      const qrCodeUri = ${serializedUri};
      const targetColor = ${serializedColor};
      const canvas = document.getElementById("qr");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      function parseHexColor(value) {
        const normalized = value.replace("#", "");
        const hex = normalized.length === 3
          ? normalized.split("").map((character) => character + character).join("")
          : normalized;

        return {
          red: Number.parseInt(hex.slice(0, 2), 16),
          green: Number.parseInt(hex.slice(2, 4), 16),
          blue: Number.parseInt(hex.slice(4, 6), 16),
        };
      }

      const replacement = parseHexColor(targetColor);
      const image = new Image();

      image.onload = () => {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const luminance = red * 0.299 + green * 0.587 + blue * 0.114;

          if (alpha === 0 || luminance >= 245) {
            pixels[index + 3] = 0;
            continue;
          }

          const darkness = 1 - luminance / 255;
          pixels[index] = replacement.red;
          pixels[index + 1] = replacement.green;
          pixels[index + 2] = replacement.blue;
          pixels[index + 3] = Math.round(alpha * darkness);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imageData, 0, 0);
      };

      image.src = qrCodeUri;
    </script>
  </body>
</html>`;
}

export function PaymentQrCode({ color, qrCodeUri }: PaymentQrCodeProps) {
  const html = useMemo(
    () => createQrHtml(qrCodeUri, color),
    [color, qrCodeUri],
  );

  return (
    <WebView
      key={qrCodeUri}
      originWhitelist={["*"]}
      scrollEnabled={false}
      source={{ html }}
      style={styles.webView}
    />
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
    height: 180,
    width: 180,
  },
});
