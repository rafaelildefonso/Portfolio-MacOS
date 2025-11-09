export const SVG_NS = "http://www.w3.org/2000/svg";

export function ID() {
  return Math.random().toString(36).slice(2);
}

/**
 * Get an element by its id and assert its type.
 *
 * @template T
 * @param {string} id
 * @param {new () => T} prototype
 * @returns {T}
 * @throws If the element with the given id is not found, or is of a different type.
 */
export function getElementById<T extends HTMLElement>(id: string, prototype: new () => T): T {
  const element = document.getElementById(id);
  if (element instanceof prototype) {
    return element;
  }
  throw new Error(
    `Element with id ${id} is not an instance of ${prototype.name}`
  );
}

/**
 * Creates a linear function that maps the given range to the given domain.
 * The resulting function is f(y) => x
 *
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @returns {(y: number) => number}
 */
export function createLinear(x0: number, y0: number, x1: number, y1: number): (y: number) => number {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return (y) => x0 + (y - y0) * (dx / dy);
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

/**
 * Creates a new Canvas element with the dimensions and content of the given ImageData.
 * @param {ImageData} imageData - The image data to draw on the canvas
 * @returns {HTMLCanvasElement} A new canvas element containing the image data
 */
export function getCanvasFromImageData(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create canvas context");
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
