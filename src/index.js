import Balsamiq from "./Balsamiq.js";

/**
 * @param {Object} data - Balsamiq JSON data
 * @param {number} padding - Padding for the canvas. Defaults to 10 to prevent items from clipping off the edge of the canvas
 * @returns {Promise} Canvas element
 */
export default function balsamiqWireframeToCanvas({ mockup }, padding = 10) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = parseInt(mockup.mockupW) + padding;
  canvas.height = parseInt(mockup.mockupH) + padding;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2.6;

  ctx.translate(
    mockup.mockupW - mockup.measuredW + padding / 2,
    mockup.mockupH - mockup.measuredH + padding / 2
  );

  mockup.controls.control
    .sort((a, b) => {
      return a.zOrder - b.zOrder;
    })
    .forEach((control) => {
      Balsamiq.render(control, ctx);
    });

  return canvas;
}
