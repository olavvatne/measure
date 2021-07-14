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
        // function onChange(e) {
        //     moveable.props.onValueLeft
        // }
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
            <input key={moveable.props.valueLeft} className="moveable-input" 
                type='tel' pattern="^-?[0-9]\d*\.?\d*$"
                style={{display: "block", margin: "auto", width: "30px", background: "transparent", color: "white"}} 
                defaultValue={moveable.props.valueLeft} onBlur={moveable.props.onValueLeft}/>
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
            <input key={moveable.props.valueRight} className="moveable-input" 
                type='tel' pattern="^-?[0-9]\d*\.?\d*$"
                style={{display: "block", margin: "auto", width: "30px", background: "transparent", color: "white"}} 
                defaultValue={moveable.props.valueRight} onBlur={moveable.props.onValueRight}/>
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
                        {edgeValue ? edgeValue.toFixed(3): null}
                    </label>

                    </div>
            </div>
        </div>
    }
};

export function MovableFluidArea({imageId, name, color, displayName, disabled, measureValues}) {
    
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    
    const [edge, setEdge] = React.useState(0);

    const targetRef = React.useRef(null);
    const moveableRef = React.useRef(null);
    
    React.useEffect(() => {
        if (moveableRef.current) {

            var frame = helper.createFrame(targetRef.current);
            if (measureValues && measureValues.rotation) {
                moveableRef.current.moveable.rotation = measureValues.rotation;
                frame.properties.transform.rotate = measureValues.rotation + "deg";
                moveableRef.current.moveable.request("rotatable", { rotate: measureValues.rotation }, true);

            }

            if (measureValues && measureValues.offsetHeight && measureValues.offsetWidth) {
                moveableRef.current.moveable.request("resizable", { offsetWidth: measureValues.offsetWidth, offsetHeight: measureValues.offsetHeight }, true);
            }

            if (measureValues && measureValues.x && measureValues.y) {
                moveableRef.current.moveable.request("draggable", { x: measureValues.x, y: measureValues.y }, true);
            }
           
            moveableRef.current.moveable.updateRect();
            moveableRef.current.moveable.updateTarget();
        }
    }, [targetRef])

    if (!measureValues || Object.keys(measureValues).length === 0) {
        return null;
    }
    const s = window.measure[name];
    const transform = `rotate(${s.rotation || 0}deg)`;
    return <div className="fluid-area">
        <div className="target" ref={targetRef} style={{transform: transform, top: measureValues.y, left: measureValues.x, width: s.offsetWidth+"px", height: s.offsetHeight+"px"}}>
        </div>
        <Moveable
            className={name + " " + color}
            key={imageId + name}
            ref={moveableRef}
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
                valueLeft: measureValues.minValue,
                valueRight: measureValues.maxValue,
                color: color,
                onValueRight: (e) => {
                    if (e.target.validity.valid) {
                        window.measure[name] = {...window.measure[name], maxValue: parseFloat(e.target.value)};
                    }
                },
                onValueLeft: (e) => {
                    if (e.target.validity.valid) {
                        window.measure[name] = {...window.measure[name], minValue: parseFloat(e.target.value)};
                    }
                },
                onEdge: (e) => {
                    setEdge(e.position);
                },
            }}
            renderDirections={["n", "s", "w", "e"]}
            origin={false}
            draggable={!disabled}
            resizable={!disabled}
            rotatable={!disabled}
            onDragStart={e => {
                helper.onDragStart(e)
            }}
            onDrag={e => {
                helper.onDrag(e)
            }}
            onDragEnd={(e) => {
                const targetMap = helper.map.get(e.target);
                const newX = (measureValues.x || 0) + parseFloat(targetMap.properties.transform.translate.value[0].replace("px", ""));
                const newY =  (measureValues.y || 0) + parseFloat(targetMap.properties.transform.translate.value[1].replace("px", ""));
                window.measure[name] = {...window.measure[name], x: newX, y: newY}
            }}
            onResizeStart={helper.onResizeStart}
            onResize={helper.onResize}
            onResizeEnd={(e) => {
                const targetMap = helper.map.get(e.target);
                const newX = (measureValues.x || 0) + parseFloat(targetMap.properties.transform.translate.value[0].replace("px", ""));
                const newY =  (measureValues.y || 0) + parseFloat(targetMap.properties.transform.translate.value[1].replace("px", ""));
                window.measure[name] = {...window.measure[name], y: newY, x: newX, offsetHeight: e.lastEvent.offsetHeight, offsetWidth: e.lastEvent.offsetWidth}
            }}
            onRotateStart={helper.onRotateStart}
            onRotate={helper.onRotate}
          
            onRotateEnd={(e) => {
                if (!window.measure[name].rotation) {
                    window.measure[name] = {...window.measure[name], rotation: e.lastEvent.rotate};
                }
                else if (Math.abs(window.measure[name].rotation - e.lastEvent.rotate) > 0.001) {
                    window.measure[name] = {...window.measure[name], rotation: e.lastEvent.rotate};
                }
                }}
            />
    </div>;
}

MovableFluidArea.propTypes = {
    name: PropTypes.string,
    imageId: PropTypes.string,
    color: PropTypes.string,
    displayName: PropTypes.string,
    measureValues: PropTypes.object,
    disabled: PropTypes.bool,
};

MovableFluidArea.defaultProps = {
    imageId: "",
    name: "og",
    color: "red",
    displayName: "O/G",
    measureValues: {minValue: 5, minValue: 10, rotation: 0, x: 20, y: 20, offsetWidth: 200, offsetHeight: 200},
    disabled: false,
  };