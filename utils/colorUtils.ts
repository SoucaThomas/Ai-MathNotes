export function darkenColor(color: string, amount: number): string {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    throw new Error("Invalid hex color format");
  }

  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = clamp(Math.floor(r * (1 - amount)), 0, 255);
  g = clamp(Math.floor(g * (1 - amount)), 0, 255);
  b = clamp(Math.floor(b * (1 - amount)), 0, 255);

  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
