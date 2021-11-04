import { ARROW_WIDTH, BORDER_WIDTH, DEFAULT_COLORS } from "./balsamiqConstants.js";

export default class Balsamiq {
  /**
   * @param {Object} control
   * @param {CanvasRenderingContext2D} ctx
   */
  static render(control, ctx) {
    let typeID = control.typeID;
    if (typeID in this) {
      ctx.save();
      this[typeID](control, ctx);
      ctx.restore();
    } else {
      console.log(`'${typeID}' control type not implemented`);
    }
  }

  static setColor(color, defaultColor, alpha = 1) {
    if (color !== undefined) {
      return `rgba(${(color >> 16) & 0xff},${(color >> 8) & 0xff},${color & 0xff},${alpha})`;
    }

    return `rgb(${defaultColor},${alpha})`;
  }

  static setFontProperties(control, ctx) {
    ctx.font = `${control.properties?.italic ? "italic " : ""}${control.properties?.bold ? "bold " : ""}${
      control.properties?.size ? control.properties.size + "px" : "13px"
    } balsamiq`;
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
    this.setFontProperties(control, ctx);

    let text = control.properties.text;
    let x = parseInt(control.x);
    if (text.includes("{color:")) {
      let { width } = ctx.measureText(text.split("{color:")[0]);
      ctx.fillStyle = `rgb(${DEFAULT_COLORS[text.split("{color:")[1].split("}")[0]]})`;
      let colorText = text.split("}")[1].split("{")[0];
      ctx.fillText(colorText, parseInt(control.x) + width, parseInt(control.y) + 4);
      text = text.split("{color:")[0];

      //create a new control object rather than altering current one
      control.properties.text = control.properties.text.split("{color}")[1];
      control.x = parseInt(control.x) + ctx.measureText(text + colorText).width + 2;
      control.properties.text && this.Label(control, ctx);
    }

    ctx.fillStyle = this.setColor(control.properties?.color, "0,0,0");
    ctx.fillText(text, x, parseInt(control.y) + 4);
  }

  static TextInput(control, ctx) {
    this.drawRectangle(control, ctx);

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.setColor(control.properties?.textColor, "0,0,0");
    this.setFontProperties(control, ctx);
    ctx.fillText(
      control.properties.text,
      parseInt(control.x) + (control.w ?? control.measuredW) / 2,
      parseInt(control.y) + control.measuredH / 2
    );
  }

  static Arrow(control, ctx) {
    let x = parseInt(control.x);
    let y = parseInt(control.y);
    let { p0, p1, p2 } = control.properties;
    let xVector = { x: (p2.x - p0.x) * p1.x, y: (p2.y - p0.y) * p1.x };

    ctx.beginPath();
    ctx.lineWidth = ARROW_WIDTH;
    ctx.strokeStyle = this.setColor(control.properties?.color, "0,0,0", control.properties?.backgroundAlpha);
    if (control.properties?.stroke === "dotted") ctx.setLineDash([0.8, 12]);
    else if (control.properties?.stroke === "dashed") ctx.setLineDash([28, 46]);
    ctx.moveTo(x + p0.x, y + p0.y);
    ctx.quadraticCurveTo(
      x + p0.x + xVector.x + xVector.y * p1.y * 3.6,
      y + p0.y + xVector.y + -xVector.x * p1.y * 3.6,
      x + control.properties.p2.x,
      y + control.properties.p2.y
    );
    ctx.stroke();
  }

  static Icon(control, ctx) {
    let x = parseInt(control.x);
    let y = parseInt(control.y);
    let width = control.measuredW - 4;

    ctx.beginPath();
    ctx.fillStyle = this.setColor(control.properties?.color, "0,0,0");
    ctx.arc(x + width / 2, y + width / 2, width / 2, 0, Math.PI * 2);
    ctx.fill();

    if (!control.properties.icon.ID.includes("check-circle")) {
      return;
    }

    ctx.beginPath();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#fff";
    ctx.moveTo(x + 4.5, y + width / 2);
    ctx.lineTo(x + 8.5, y + width / 2 + 4);
    ctx.lineTo(x + 15, y + width / 2 - 2.5);
    ctx.stroke();
  }

  static HRule(control, ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.setColor(control.properties?.color, "0,0,0", control.properties?.backgroundAlpha);
    if (control.properties?.stroke === "dotted") ctx.setLineDash([0.8, 8]);
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
