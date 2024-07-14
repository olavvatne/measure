const LabelLeftViewable = {
  name: "LabelLeftViewable",
  props: { displayName: String, valueLeft: Number },
  events: {},
  render(moveable, React) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;
    const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${
      rect.rotation
    }deg)  translate(${-rect.offsetWidth - 30}px, -50px)`;
    return (
      <div
        key={"label-viewer-left"}
        className={"moveable-label-left"}
        style={{
          position: "absolute",
          left: `0px`,
          top: `0px`,
          background: "var(--able-color)",
          borderRadius: "2px",
          padding: "2px 4px",
          color: "white",
          fontSize: "13px",
          whiteSpace: "nowrap",
          fontWeight: "bold",
          willChange: "transform",
          transform: transform,
          transformOrigin: "0px 0px",
        }}
      >
        <label style={{ display: "block" }}>
          Start {moveable.props.displayName}
        </label>
        <input
          key={moveable.props.valueLeft}
          className="moveable-input"
          type="tel"
          pattern="^-?[0-9]\d*\.?\d*$"
          style={{
            display: "block",
            margin: "auto",
            width: "30px",
            background: "transparent",
            color: "white",
          }}
          defaultValue={moveable.props.valueLeft}
          onBlur={(e) => {
            moveable.props.onValueLeft(e);
          }}
        />
      </div>
    );
  },
};

export default LabelLeftViewable;
