export const SVG_NS = "http://www.w3.org/2000/svg";

export function ID() {
  return Math.random().toString(36).slice(2);
}

export function getCanvasFromImageData(imageData: ImageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) throw new Error("Failed to create canvas context");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function createLinear(x0: number, y0: number, x1: number, y1: number) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return (y: number) => x0 + (y - y0) * (dx / dy);
}

export function createQuadratic(x0: number, y0: number, x1: number, y1: number) {
  return (y: number) => x0 + Math.pow((y - y0) / (y1 - y0), 2) * (x1 - x0);
}

export function generateBoundingBox(...points: Array<{ x: number; y: number }>) {
  const left = Math.min(...points.map((pt) => pt.x));
  const top = Math.min(...points.map((pt) => pt.y));
  const right = Math.max(...points.map((pt) => pt.x));
  const bottom = Math.max(...points.map((pt) => pt.y));
  const width = right - left;
  const height = bottom - top;
  return new DOMRect(left, top, width, height);
}
