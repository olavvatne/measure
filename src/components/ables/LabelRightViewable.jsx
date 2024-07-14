const LabelRightViewable = {
  name: "LabelRightViewable",
  props: { displayName: String, valueRight: Number },
  events: {},
  render(moveable, React) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;
    const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg)  translate(-30px, -50px)`;

    return (
      <div
        key={"label-right-viewer"}
        className={"moveable-label-right"}
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
          End {moveable.props.displayName}
        </label>
        <input
          key={moveable.props.valueRight}
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
          defaultValue={moveable.props.valueRight}
          onBlur={(e) => {
            moveable.props.onValueRight(e);
          }}
        />
      </div>
    );
  },
};

export default LabelRightViewable;
