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
            <input key={moveable.props.valueLeft} className="moveable-input" 
                type='tel' pattern="^-?[0-9]\d*\.?\d*$"
                style={{display: "block", margin: "auto", width: "30px", background: "transparent", color: "white"}} 
                defaultValue={moveable.props.valueLeft} onBlur={(e) => {moveable.props.onValueLeft(e)}}/>
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
                defaultValue={moveable.props.valueRight} onBlur={(e) => {moveable.props.onValueRight(e)}}/>
        </div>
    }
};

function posToValue(pos, padding, width, valueLeft, valueRight) {
    const lineInPixel = width - 2 * padding;
    const lineInValue = valueRight - valueLeft;
    const lineToPos = pos - padding;
    const edgeValue = (lineToPos / lineInPixel * lineInValue) + valueLeft;
    return edgeValue;
}

function valueToPos(value, padding, width, valueLeft, valueRight) {
    if (value === null) {
        return null;
    }
    const lineInPixel = width - 2 * padding;
    const lineInValue = valueRight - valueLeft;
    const valueToPos = (value - valueLeft) / lineInValue * lineInPixel;
    const posWithpadding = valueToPos + padding;
    return posWithpadding;
}

const EdgeClickable = {
    name: "EdgeClickable",
    props: {color: String, name: String, fluidEdge: Number, valueLeft: Number, valueRight: Number},
    events: {},
    render(moveable, React) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;

        const padding = Math.max(30, rect.offsetWidth * 0.05);
        const pos = valueToPos(moveable.props.fluidEdge, padding, rect.offsetWidth, moveable.props.valueLeft, moveable.props.valueRight);
        const edgeValue = moveable.props.fluidEdge;
        const transform = `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg)  translate(${-rect.offsetWidth}px, 00px)`
        return <div key={"edge-clickable-viewer"} 
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
                transformOrigin: "0px 0px"
        }}>
            <div style={{width: rect.offsetWidth, height: rect.offsetHeight}} onClick={moveable.props.onFluidEdge}>
                <div style={{
                    position: "absolute",
                    pointerEvents: "none",
                    borderLeft: "2px dotted "  + moveable.props.color, 
                    borderRight: "2px dotted " + moveable.props.color,
                    width: rect.offsetWidth - padding * 2, 
                    height: rect.offsetHeight,
                    left: padding,
                }}></div>
                {pos !== null ? <div className="edge-line" style={{
                    width: "1px",
                    height: rect.offsetHeight, 
                    left: pos, 
                    position: "relative"}}>
                    <label style={{position: "relative", left: - 30, top: "-80px"}}>
                        {edgeValue ? edgeValue.toFixed(3): null}
                    </label>

                    </div>: null }
            </div>
        </div>
    }
};

export function MovableFluidArea({imageId = "", name = "og", color = "red", displayName = "O/G", disabled=false, measureValues={minValue: 5, minValue: 10, rotation: 0, x: 20, y: 20, offsetWidth: 200, offsetHeight: 200}, value=null, setValue= () => {}, setMeasureValues = () => {}}) {
    
    const [helper] = React.useState(() => {
        return new MoveableHelper();
    })
    
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
    const s = measureValues;
    const transform = `rotate(${s.rotation || 0}deg)`;

    function onFluidEdge(e) {
        const padding = Math.max(30, e.target.offsetWidth * 0.05);
        const value = posToValue( e.nativeEvent.offsetX, padding, e.target.offsetWidth, measureValues.minValue, measureValues.maxValue);
        setValue(value)
    }

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
                fluidEdge: value,
                displayName: displayName,
                valueLeft: measureValues.minValue,
                valueRight: measureValues.maxValue,
                color: color,
                onValueRight: (e) => {
                    if (e.target.validity.valid) {
                        setMeasureValues({...measureValues, maxValue: parseFloat(e.target.value)});
                    }
                },
                onValueLeft: (e) => {
                    if (e.target.validity.valid) {
                        setMeasureValues({...measureValues, minValue: parseFloat(e.target.value)});
                    }
                },
                onFluidEdge: onFluidEdge
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
                setMeasureValues({...measureValues, x: newX, y: newY});
            }}
            onResizeStart={helper.onResizeStart}
            onResize={helper.onResize}
            onResizeEnd={(e) => {
                const targetMap = helper.map.get(e.target);
                const newX = (measureValues.x || 0) + parseFloat(targetMap.properties.transform.translate.value[0].replace("px", ""));
                const newY =  (measureValues.y || 0) + parseFloat(targetMap.properties.transform.translate.value[1].replace("px", ""));
                setMeasureValues({...measureValues, y: newY, x: newX, offsetHeight: e.lastEvent.offsetHeight, offsetWidth: e.lastEvent.offsetWidth});
            }}
            onRotateStart={helper.onRotateStart}
            onRotate={helper.onRotate}
          
            onRotateEnd={(e) => {
                if (!measureValues.rotation) {
                    setMeasureValues({...measureValues, rotation: e.lastEvent.rotate});
                }
                else if (Math.abs(measureValues.rotation - e.lastEvent.rotate) > 0.001) {
                    setMeasureValues({...measureValues, rotation: e.lastEvent.rotate});
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
    value: PropTypes.number,
    setValue: PropTypes.func,
    setMeasureValues: PropTypes.func,
};
