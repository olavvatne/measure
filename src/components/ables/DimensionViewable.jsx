const DimensionViewable = {
    name: "dimensionViewable",
    props: {color: String},
    events: {},
    render(moveable, React) {
        const rect = moveable.getRect();

        return <div key={"dimension-viewer"} 
            className={moveable.props.color + "moveable-dimension"} 
            style={{
            position: "absolute",
            left: `${rect.width / 2}px`,
            top: `${rect.height + 20}px`,
            background: "#4af",
            borderRadius: "2px",
            padding: "2px 4px",
            color: "white",
            fontSize: "13px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            willChange: "transform",
            transform: "translate(-50%, 0px)",
        }}>
            {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
        </div>
    }
};

export default DimensionViewable;
