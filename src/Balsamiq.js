import { getRGBFromDecimalColor } from "./utils.js";

export default class Balsamiq {
  /**
   * @param {Object} control
   * @param {CanvasRenderingContext2D} ctx
   */
  static render(control, ctx) {
    let typeID = control.typeID;
    this[typeID]?.(control, ctx) ?? console.log(`'${typeID}' rendering not implemented`);
  }

  static TextArea(control, ctx) {
    ctx.beginPath();
    ctx.strokeStyle =
      control.properties?.borderColor !== undefined
        ? getRGBFromDecimalColor(control.properties.borderColor, 1)
        : `rgba(0,0,0,1)`;
    ctx.fillStyle =
      control.properties?.color !== undefined
        ? getRGBFromDecimalColor(control.properties.color, control.properties?.backgroundAlpha)
        : `rgba(255,255,255,${control.properties?.backgroundAlpha ?? 1})`;
    ctx.rect(control.x, control.y, control.w || control.measuredW, control.h || control.measuredH);
    ctx.fill();
    ctx.stroke();

    return 0;
  }

  static Canvas(control, ctx) {
    ctx.beginPath();
    ctx.strokeStyle =
      control.properties?.borderColor !== undefined
        ? getRGBFromDecimalColor(control.properties.borderColor, 1)
        : `rgba(0,0,0,1)`;
    ctx.fillStyle =
      control.properties?.color !== undefined
        ? getRGBFromDecimalColor(control.properties.color, control.properties?.backgroundAlpha)
        : `rgba(255,255,255,${control.properties?.backgroundAlpha ?? 1})`;
    ctx.rect(control.x, control.y, control.w || control.measuredW, control.h || control.measuredH);
    ctx.fill();
    ctx.stroke();

    return 0;
  }

  static Label(control, ctx) {
    ctx.beginPath();
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    if (control.properties?.size) {
      ctx.font = `${control.properties?.bold ? "bold " : ""}${control.properties.size}px balsamiq`;
    } else {
      ctx.font = "13px balsamiq";
    }
    ctx.fillStyle =
      control.properties?.color !== undefined
        ? getRGBFromDecimalColor(control.properties.color, 1)
        : `rgba(0,0,0,1)`;
    ctx.fillText(control.properties.text, control.x, parseInt(control.y) + 4);

    return 0;
  }

  static TextInput(control, ctx) {
    ctx.beginPath();
    ctx.strokeStyle =
      control.properties?.borderColor !== undefined
        ? getRGBFromDecimalColor(control.properties.borderColor, 1)
        : `rgba(0,0,0,1)`;
    ctx.fillStyle =
      control.properties?.color !== undefined
        ? getRGBFromDecimalColor(control.properties.color, control.properties?.backgroundAlpha)
        : `rgba(255,255,255,${control.properties?.backgroundAlpha ?? 1})`;
    ctx.rect(control.x, control.y, control.w || control.measuredW, control.h || control.measuredH);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (control.properties?.size) {
      ctx.font = `${control.properties?.bold ? "bold " : ""}${control.properties.size}px balsamiq`;
    } else {
      ctx.font = "13px balsamiq";
    }
    ctx.fillStyle =
      control.properties?.textColor !== undefined
        ? getRGBFromDecimalColor(control.properties.textColor, 1)
        : `rgba(0,0,0,1)`;
    ctx.fillText(
      control.properties.text,
      parseInt(control.x) + (control.w || control.measuredW) / 2,
      parseInt(control.y) + control.measuredH / 2
    );

    return 0;
  }
}
