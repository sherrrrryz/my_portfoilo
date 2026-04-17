export interface SampledPoint {
  x: number;
  y: number;
}

/**
 * Renders text on an offscreen canvas, samples filled pixels,
 * and returns evenly-distributed points for particle placement.
 *
 * For the grainy particle effect, we need thousands of points
 * scattered within the text shape (not just on edges).
 */
export function sampleTextPoints(
  text: string,
  fontSize: number,
  maxPoints: number,
  canvasWidth: number,
  canvasHeight: number
): SampledPoint[] {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d")!;

  // Render text centered
  ctx.fillStyle = "white";
  ctx.font = `900 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const { data, width } = imageData;

  // Collect all filled pixels
  const filledPixels: { x: number; y: number }[] = [];
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 80) {
        filledPixels.push({ x, y });
      }
    }
  }

  if (filledPixels.length === 0) return [];

  // Randomly sample from filled pixels for a natural scattered look
  const sampled: SampledPoint[] = [];
  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.floor(Math.random() * filledPixels.length);
    const { x, y } = filledPixels[idx];
    // Add slight sub-pixel jitter for organic feel
    sampled.push({
      x: x + (Math.random() - 0.5) * 2,
      y: y + (Math.random() - 0.5) * 2,
    });
  }

  return sampled;
}
