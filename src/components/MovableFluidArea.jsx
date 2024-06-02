import * as React from "react";
import PropTypes from "prop-types";
import Moveable from "react-moveable";
import MoveableHelper from "moveable-helper";
import "./MovableFluidArea.css"
import { EdgeClickable, DimensionViewable, LabelLeftViewable, LabelRightViewable } from "./ables";

function posToValue(pos, padding, width, valueLeft, valueRight) {
    const lineInPixel = width - 2 * padding;
    const lineInValue = valueRight - valueLeft;
    const lineToPos = pos - padding;
    const edgeValue = (lineToPos / lineInPixel * lineInValue) + valueLeft;
    return edgeValue;
}


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
