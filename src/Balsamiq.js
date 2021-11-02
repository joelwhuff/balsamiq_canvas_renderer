import { getRGBFromDecimalColor } from "./utils.js";

const DEFAULT_COLORS = {
  blue: "43,120,228",
};

export default class Balsamiq {
  /**
   * @param {Object} control
   * @param {CanvasRenderingContext2D} ctx
   */
  static render(control, ctx) {
    let typeID = control.typeID;
    if (typeID in this) {
      this[typeID](control, ctx);
    } else {
      console.log(`'${typeID}' rendering not implemented`);
    }
  }

  static setColor(color, defaultColor, alpha = 1) {
    if (color !== undefined) {
      return getRGBFromDecimalColor(color, alpha);
    }

    return `rgb(${defaultColor},${alpha})`;
  }

  static drawRectangle(control, ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.setColor(
      control.properties?.color,
      "255,255,255",
      control.properties?.backgroundAlpha
    );
    ctx.strokeStyle = this.setColor(control.properties?.borderColor, "0,0,0");
    ctx.rect(control.x, control.y, control.w ?? control.measuredW, control.h ?? control.measuredH);
    ctx.fill();
    ctx.stroke();
  }

  static TextArea(control, ctx) {
    this.drawRectangle(control, ctx);
  }

  static Canvas(control, ctx) {
    this.drawRectangle(control, ctx);
  }

  static Label(control, ctx) {
    ctx.beginPath();
    ctx.textAlign = "start";
    ctx.textBaseline = "top";
    ctx.fillStyle = this.setColor(control.properties?.color, "0,0,0");
    if (control.properties?.size) {
      ctx.font = `${control.properties?.bold ? "bold " : ""}${control.properties.size}px balsamiq`;
    } else {
      ctx.font = "13px balsamiq";
    }
    ctx.fillText(control.properties.text, control.x, parseInt(control.y) + 4);
  }

  static TextInput(control, ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.setColor(
      control.properties?.color,
      "255,255,255",
      control.properties?.backgroundAlpha
    );
    ctx.strokeStyle = this.setColor(control.properties?.borderColor, "0,0,0");
    ctx.rect(control.x, control.y, control.w ?? control.measuredW, control.h ?? control.measuredH);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.setColor(control.properties?.textColor, "0,0,0");
    if (control.properties?.size) {
      ctx.font = `${control.properties?.bold ? "bold " : ""}${control.properties.size}px balsamiq`;
    } else {
      ctx.font = "13px balsamiq";
    }
    ctx.fillText(
      control.properties.text,
      parseInt(control.x) + (control.w ?? control.measuredW) / 2,
      parseInt(control.y) + control.measuredH / 2
    );
  }

  static Arrow(control, ctx) {}

  static Icon(control, ctx) {}

  static HRule(control, ctx) {}
}
