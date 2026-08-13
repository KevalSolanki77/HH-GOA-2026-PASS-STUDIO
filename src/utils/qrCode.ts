import QRCode from "qrcode";

export function drawPassQRCode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  payload: string | object,
  accentColor: string = "#38BDF8",
  bgColor: string = "rgba(2, 6, 23, 0.95)"
) {
  ctx.save();
  ctx.translate(x, y);

  const borderRadius = Math.min(12, size * 0.08);

  // Background Box with High Contrast
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, borderRadius);
  ctx.fill();

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.max(1.5, size * 0.015);
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, borderRadius);
  ctx.stroke();

  const textPayload = typeof payload === "string" ? payload : JSON.stringify(payload);

  try {
    const qr = QRCode.create(textPayload, { errorCorrectionLevel: "M" });
    const matrixSize = qr.modules.size;
    const padding = size * 0.08;
    const availableSize = size - padding * 2;
    const cellSize = availableSize / matrixSize;

    ctx.fillStyle = accentColor;

    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (qr.modules.get(row, col)) {
          ctx.fillRect(
            padding + col * cellSize,
            padding + row * cellSize,
            cellSize + 0.3, // Slight overlap to avoid hairline gaps
            cellSize + 0.3
          );
        }
      }
    }
  } catch (err) {
    console.warn("QR code generator fallback:", err);
    const padding = size * 0.08;
    const matrixSize = 15;
    const cellSize = (size - padding * 2) / matrixSize;

    ctx.fillStyle = accentColor;

    const drawFinder = (fx: number, fy: number) => {
      ctx.fillRect(padding + fx * cellSize, padding + fy * cellSize, 3 * cellSize, 3 * cellSize);
      ctx.fillStyle = bgColor;
      ctx.fillRect(padding + (fx + 0.5) * cellSize, padding + (fy + 0.5) * cellSize, 2 * cellSize, 2 * cellSize);
      ctx.fillStyle = accentColor;
      ctx.fillRect(padding + (fx + 1) * cellSize, padding + (fy + 1) * cellSize, 1 * cellSize, 1 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(matrixSize - 3, 0);
    drawFinder(0, matrixSize - 3);

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c > matrixSize - 5) || (r > matrixSize - 5 && c < 4)) continue;
        if ((r + c) % 2 === 0) {
          ctx.fillRect(padding + c * cellSize, padding + r * cellSize, cellSize * 0.9, cellSize * 0.9);
        }
      }
    }
  }

  ctx.restore();
}

