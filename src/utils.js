export function getRGBFromDecimalColor(color, alpha = 1) {
  let red = (color >> 16) & 0xff;
  let green = (color >> 8) & 0xff;
  let blue = color & 0xff;
  return `rgba(${red},${green},${blue},${alpha})`;
}
