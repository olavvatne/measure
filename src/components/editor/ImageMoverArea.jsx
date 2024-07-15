import React, { useContext, useState } from "react";
import { ViewContext } from "../../state/ViewContext.js";

export default function ImageMoverArea({ imageMode, children }) {
  const { view, setView } = useContext(ViewContext);
  const [imageLocation, setImageLocation] = useState({
    panning: false,
    start: { x: 0, y: 0 },
  });

  function onZoom(e) {
    if (!imageMode) return;
    let { pointX, pointY, scale } = view.editor;
    var xs = (e.clientX - pointX) / scale,
      ys = (e.clientY - pointY) / scale,
      delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
    delta > 0 ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
    setView({ ...view, editor: { scale, pointX, pointY } });
  }
  function onMouseDown(e) {
    if (!imageMode) return;
    e.preventDefault();
    let { pointX, pointY } = view.editor;
    const start = { x: e.clientX - pointX, y: e.clientY - pointY };
    setImageLocation({ ...imageLocation, start, panning: true });
  }
  function onMouseUp(e) {
    if (!imageMode) return;
    e.preventDefault();
    setImageLocation({ ...imageLocation, panning: false });
  }
  function onMouseMove(e) {
    if (!imageMode) return;
    e.preventDefault();
    let { pointX, pointY, scale } = view.editor;
    let { panning, start } = imageLocation;
    if (!panning) {
      return;
    }
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    setView({ ...view, editor: { scale, pointX, pointY } });
  }

  return (
    <div
      id="zoom"
      style={{
        transform: `translate(${view.editor.pointX}px, ${view.editor.pointY}px)  scale(${view.editor.scale})`,
      }}
      onWheel={onZoom}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}
