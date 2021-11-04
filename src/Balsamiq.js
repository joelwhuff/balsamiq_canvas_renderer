import { BORDER_WIDTH, DEFAULT_COLORS } from "./balsamiqConstants.js";
import { getRGBFromDecimalColor } from "./utils.js";

export default class Balsamiq {
  /**
   * @param {Object} control
   * @param {CanvasRenderingContext2D} ctx
   */
  static render(control, ctx) {
    let typeID = control.typeID;
    if (typeID in this) {
      //maybe save ctx state here
      this[typeID](control, ctx);
      //ctx.restore
    } else {
      console.log(`'${typeID}' control type not implemented`);
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
    ctx.rect(
      parseInt(control.x) + BORDER_WIDTH / 2,
      parseInt(control.y) + BORDER_WIDTH / 2,
      (control.w ?? control.measuredW) - BORDER_WIDTH,
      (control.h ?? control.measuredH) - BORDER_WIDTH
    );
    ctx.fill();
    ctx.stroke();
  }

  static TextArea(control, ctx) {
    this.drawRectangle(control, ctx);
    // handle text rendering
  }

  static Canvas(control, ctx) {
    this.drawRectangle(control, ctx);
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

    let text = control.properties.text;
    let x = parseInt(control.x);

    if (text.includes("{color:")) {
      let { width } = ctx.measureText(text.split("{color:")[0]);
      ctx.fillStyle = `rgb(${DEFAULT_COLORS[text.split("{color:")[1].split("}")[0]]})`;
      let colorText = text.split("}")[1].split("{")[0];
      ctx.fillText(colorText, parseInt(control.x) + width, parseInt(control.y) + 4);
      text = text.split("{color:")[0];

      control.properties.text = control.properties.text.split("{color}")[1];
      control.x = parseInt(control.x) + ctx.measureText(text + colorText).width + 2;
      control.properties.text && this.Label(control, ctx);
    }

    ctx.fillStyle = this.setColor(control.properties?.color, "0,0,0");
    ctx.fillText(text, x, parseInt(control.y) + 4);
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

  static Arrow(control, ctx) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.setColor(control.properties?.color, "0,0,0", control.properties?.backgroundAlpha);
    if (control.properties?.stroke === "dotted") ctx.setLineDash([0.8, 12]);
    else if (control.properties?.stroke === "dashed") ctx.setLineDash([28, 46]);

    let x = parseInt(control.x);
    let y = parseInt(control.y);
    let vec = {
      x: control.properties.p2.x - control.properties.p0.x,
      y: control.properties.p2.y - control.properties.p0.y,
    };
    vec.x *= control.properties.p1.x;
    vec.y *= control.properties.p1.x;

    let perpVec = {
      x: vec.y * control.properties.p1.y * 3.6,
      y: -vec.x * control.properties.p1.y * 3.6,
    };

    let ctrl = { x: vec.x + perpVec.x, y: vec.y + perpVec.y };

    ctx.moveTo(x + control.properties.p0.x, y + control.properties.p0.y);
    ctx.quadraticCurveTo(
      x + control.properties.p0.x + ctrl.x,
      y + control.properties.p0.y + ctrl.y,
      x + control.properties.p2.x,
      y + control.properties.p2.y
    );
    ctx.stroke();

    ctx.setLineDash([]);
  }

  static Icon(control, ctx) {
    let width = control.measuredW - 4;

    ctx.beginPath();
    ctx.fillStyle = this.setColor(control.properties?.color, "0,0,0");
    ctx.arc(parseInt(control.x) + width / 2, parseInt(control.y) + width / 2, width / 2, 0, Math.PI * 2);
    ctx.fill();

    if (!control.properties.icon.ID.includes("check-circle")) {
      return;
    }

    ctx.beginPath();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#fff";
    ctx.moveTo(parseInt(control.x) + 4.5, parseInt(control.y) + width / 2);
    ctx.lineTo(parseInt(control.x) + 8.5, parseInt(control.y) + width / 2 + 4);
    ctx.lineTo(parseInt(control.x) + 15, parseInt(control.y) + width / 2 - 2.5);
    ctx.stroke();
  }

  static HRule(control, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.setColor(control.properties?.color, "0,0,0", control.properties?.backgroundAlpha);
    if (control.properties?.stroke === "dotted") ctx.setLineDash([0.7, 7.5]);
    else if (control.properties?.stroke === "dashed") ctx.setLineDash([18, 30]);
    ctx.moveTo(control.x, control.y);
    ctx.lineTo(parseInt(control.x) + parseInt(control.w ?? control.measuredW), control.y);
    ctx.stroke();
  }

  static __group__(control, ctx) {
    control.children.controls.control
      .sort((a, b) => {
        return a.zOrder - b.zOrder;
      })
      .forEach((childControl) => {
        childControl.x = parseInt(childControl.x) + parseInt(control.x);
        childControl.y = parseInt(childControl.y) + parseInt(control.y);
        this.render(childControl, ctx);
      });
  }
}
