export function getRGBFromDecimalColor(color, alpha) {
  let red = (color >> 16) & 0xff;
  let green = (color >> 8) & 0xff;
  let blue = color & 0xff;
  return `rgba(${red},${green},${blue},${alpha})`;
}
