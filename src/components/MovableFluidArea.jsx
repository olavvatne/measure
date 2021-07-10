import * as React from "react";
import PropTypes from "prop-types";
import Moveable from "react-moveable";
import MoveableHelper from "moveable-helper";
import "./MovableFluidArea.css"

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

const LabelLeftViewable = {
    name: "LabelLeftViewable",
    props: {color: String, displayName: String, valueLeft: Number},
    events: {},
    render(moveable, React) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;
        
        const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg)  translate(${-rect.offsetWidth- 30}px, -50px)`
        return <div key={"label-viewer-left"} 
            className={"moveable-label-left"} 
            style={{
                position: "absolute",
                left: `0px`,
                top: `0px`,
                background: moveable.props.color,
                borderRadius: "2px",
                padding: "2px 4px",
                color: "white",
                fontSize: "13px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                willChange: "transform",
                transform: transform,
                transformOrigin: "0px 0px"
        }}>
            <label style={{display: "block"}}>Start {moveable.props.displayName}</label>
            <label style={{textAlign: "center"}}>{moveable.props.valueLeft}</label>
        </div>
    }
};



const LabelRightViewable = {
    name: "LabelRightViewable",
    props: {color: String, displayName: String, valueRight: Number},
    events: {},
    render(moveable, React) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;
        const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg)  translate(-30px, -50px)`
        return <div key={"label-right-viewer"} 
            className={"moveable-label-right"} 
            style={{
                position: "absolute",
                left: `0px`,
                top: `0px`,
                background: moveable.props.color,
                borderRadius: "2px",
                padding: "2px 4px",
                color: "white",
                fontSize: "13px",
                whiteSpace: "nowrap",
                fontWeight: "bold",
                willChange: "transform",
                transform: transform,
                transformOrigin: "0px 0px"
        }}>
            <label style={{display: "block"}}>End {moveable.props.displayName}</label>
            <label style={{textAlign: "center"}}>{moveable.props.valueRight}</label>
        </div>
    }
};

const EdgeClickable = {
    name: "EdgeClickable",
    props: {color: String, onEdge: Function, name: String, fluidEdge: Number, valueLeft: Number, valueRight: Number},
    events: {},
    render(moveable, React) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;
        function onFluidEdge(e) {
            console.log(e.nativeEvent.offsetX);
            moveable.props.onEdge({position: e.nativeEvent.offsetX, name: moveable.props.name})
        }
        const padding = Math.max(30, rect.offsetWidth * 0.05);
        const lineInPixel = rect.offsetWidth - 2 * padding;
		const lineInValue = moveable.props.valueRight - moveable.props.valueLeft;
        const lineToPos = moveable.props.fluidEdge - padding;
		const edgeValue = (lineToPos / lineInPixel * lineInValue) + moveable.props.valueLeft;
        
        const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg)  translate(${-rect.offsetWidth}px, 00px)`
        return <div key={"edge-clickable-viewer"} onClick={onFluidEdge} 
            className={"moveable-edge-clickable"} 
            style={{
                position: "absolute",
                left: `0px`,
                top: `0px`,
                color: "white",
                fontSize: "13px",
                // padding: `0px ${padding}px`,
                whiteSpace: "nowrap",
                fontWeight: "bold",
                willChange: "transform",
                transform: transform,
                transformOrigin: "0px 0px"
        }}>
            <div style={{width: rect.offsetWidth, height: rect.offsetHeight}}>
                <div style={{
                    position: "absolute",
                    pointerEvents: "none",
                    borderLeft: "2px dotted "  + moveable.props.color, 
                    borderRight: "2px dotted " + moveable.props.color,
                    width: rect.offsetWidth - padding * 2, 
                    height: rect.offsetHeight,
                    left: padding,
                }}></div>
                <div className="edge-line" style={{
                    width: "1px",
                    height: rect.offsetHeight, 
                    left: moveable.props.fluidEdge, 
                    position: "relative"}}>
                    <label style={{position: "relative", left: - 30, top: "-80px"}}>
                        {edgeValue.toFixed(3)}
                    </label>

                    </div>
            </div>
        </div>
    }
};

export function MovableFluidArea({name, color, displayName, position, disabled}) {
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })

    const [edge, setEdge] = React.useState(0);
    position = position === "left" ? "150px" : "500px";
    const targetRef = React.useRef(null);
    
    return <div className="fluid-area">
        <div className="target" ref={targetRef} style={{"left": position}}>
            
        </div>
        <Moveable
            className={name + " " + color}
            target={targetRef}
            ables={[DimensionViewable, LabelLeftViewable, LabelRightViewable, EdgeClickable]}
            props={{
                dimensionViewable: true,
                LabelLeftViewable: true,
                LabelRightViewable: true,
                EdgeClickable: true,
                name: name,
                fluidEdge: edge,
                displayName: displayName,
                valueLeft: 10,
                valueRight: 20,
                color: color,
                onEdge: (e) => {
                    setEdge(e.position);
                }
            }}
            renderDirections={["n", "s", "w", "e"]}
            
            origin={false}
            draggable={!disabled}
            resizable={!disabled}
            rotatable={!disabled}
            onDragStart={helper.onDragStart}
            onDrag={helper.onDrag}
            onResizeStart={helper.onResizeStart}
            onResize={helper.onResize}
            onRotateStart={helper.onRotateStart}
            onRotate={helper.onRotate}
            />
    </div>;
}

MovableFluidArea.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    displayName: PropTypes.string,
    position: PropTypes.string,
    position: PropTypes.string,
    disabled: PropTypes.bool,
};

MovableFluidArea.defaultProps = {
    name: "og",
    color: "red",
    displayName: "O/G",
    position: "left",
    disabled: false,
  };