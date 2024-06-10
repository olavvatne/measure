import MoveableFrame from "./MoveableFrame";
import PropTypes from "prop-types";
import * as React from "react";
import Moveable from "react-moveable";
import "./MovableFluidArea.css";
import { DimensionViewable, EdgeClickable, LabelLeftViewable, LabelRightViewable } from "./ables";

function posToValue(pos, padding, width, valueLeft, valueRight) {
    const lineInPixel = width - 2 * padding;
    const lineInValue = valueRight - valueLeft;
    const lineToPos = pos - padding;
    const edgeValue = (lineToPos / lineInPixel * lineInValue) + valueLeft;
    return edgeValue;
}

const framer = new MoveableFrame();
export function MovableFluidArea({imageId = "", name = "og", color = "red", displayName = "O/G", disabled=false, measureValues={minValue: 5, minValue: 10, rotation: 0, x: 20, y: 20, offsetWidth: 200, offsetHeight: 200}, value=null, setValue= () => {}, setMeasureValues = () => {}}) {
        
    const targetRef = React.useRef(null);
    const moveableRef = React.useRef(null);
    
    React.useEffect(() => {
        if (moveableRef.current) {

            var frame = framer.createFrame(targetRef.current);
            if (measureValues && measureValues.rotation) {
                moveableRef.current.moveable.rotation = measureValues.rotation;
                frame.transform.rotate = measureValues.rotation;
                moveableRef.current.moveable.request("rotatable", { rotate: measureValues.rotation }, true);

            }

            if (measureValues && measureValues.offsetHeight && measureValues.offsetWidth) {
                frame.dimensions.width = measureValues.offsetWidth;
                frame.dimensions.height = measureValues.offsetHeight;
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
                framer.onDragStart(e)
            }}
            onDrag={e => {
                framer.onDrag(e)
            }}
            onDragEnd={(e) => {
                const translate = framer.getTranslate(e.target);

                const newX = (measureValues.x || 0) + translate.x;
                const newY =  (measureValues.y || 0) + translate.y;
                setMeasureValues({...measureValues, x: newX, y: newY});
            }}
            onResizeStart={framer.onResizeStart}
            onResize={framer.onResize}
            onResizeEnd={(e) => {
                const translate = framer.getTranslate(e.target);
                const newX = (measureValues.x || 0) + translate.x;
                const newY =  (measureValues.y || 0) + translate.y;
                setMeasureValues({...measureValues, y: newY, x: newX, offsetHeight: e.lastEvent.offsetHeight, offsetWidth: e.lastEvent.offsetWidth});
            }}
            onRotateStart={framer.onRotateStart}
            onRotate={framer.onRotate}
          
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
