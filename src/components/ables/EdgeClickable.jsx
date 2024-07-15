function valueToPos(value, padding, width, valueLeft, valueRight) {
  if (value === null) {
    return null;
  }
  const lineInPixel = width - 2 * padding;
  const lineInValue = valueRight - valueLeft;
  const valueToPos = ((value - valueLeft) / lineInValue) * lineInPixel;
  const posWithpadding = valueToPos + padding;
  return posWithpadding;
}

const EdgeClickable = {
  name: "EdgeClickable",
  props: {
    measureEdge: Number,
    valueLeft: Number,
    valueRight: Number,
    onMeasureEdge: Function,
  },
  events: {},
  render(moveable, React) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;

    const padding = Math.max(30, rect.offsetWidth * 0.05);
    const pos = valueToPos(
      moveable.props.measureEdge,
      padding,
      rect.offsetWidth,
      moveable.props.valueLeft,
      moveable.props.valueRight
    );
    const edgeValue = moveable.props.measureEdge;
    const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${
      rect.rotation
    }deg)  translate(${-rect.offsetWidth}px, 00px)`;
    return (
      <div
        key={"edge-clickable-viewer"}
        className={"moveable-edge-clickable"}
        style={{
          position: "absolute",
          left: `0px`,
          top: `0px`,
          color: "white",
          fontSize: "13px",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          willChange: "transform",
          transform: transform,
          transformOrigin: "0px 0px",
        }}
      >
        <div
          style={{ width: rect.offsetWidth, height: rect.offsetHeight }}
          onClick={moveable.props.onMeasureEdge}
        >
          <div
            style={{
              position: "absolute",
              pointerEvents: "none",
              borderLeft: "2px dotted var(--able-color)",
              borderRight: "2px dotted var(--able-color)",
              width: rect.offsetWidth - padding * 2,
              height: rect.offsetHeight,
              left: padding,
            }}
          ></div>
          {pos !== null ? (
            <div
              className="edge-line"
              style={{
                width: "1px",
                pointerEvents: "none",
                height: rect.offsetHeight,
                left: pos,
                position: "relative",
              }}
            >
              <label
                style={{
                  position: "relative",
                  left: -30,
                  top: "-80px",
                  padding: "2px 4px",
                  background: "var(--able-color)",
                }}
              >
                {edgeValue ? edgeValue.toFixed(3) : null}
              </label>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
};

export default EdgeClickable;
