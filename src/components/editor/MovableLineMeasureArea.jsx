import PropTypes from "prop-types";
import * as React from "react";
import Moveable from "react-moveable";
import {
  DimensionViewable,
  EdgeClickable,
  LabelLeftViewable,
  LabelRightViewable,
} from "../ables";
import "./MovableLineMeasureArea.css";
import MoveableFrame from "./MoveableFrame";

function posToValue(pos, padding, width, valueLeft, valueRight) {
  const lineInPixel = width - 2 * padding;
  const lineInValue = valueRight - valueLeft;
  const lineToPos = pos - padding;
  const edgeValue = (lineToPos / lineInPixel) * lineInValue + valueLeft;
  return edgeValue;
}

const framer = new MoveableFrame();
export default function MovableLineMeasureArea({
  color = "red",
  displayName = "O/G",
  disabled = false,
  boundaryArea = {
    minValue: 5,
    minValue: 10,
    rotation: 0,
    x: 20,
    y: 20,
    offsetWidth: 200,
    offsetHeight: 200,
  },
  value = null,
  setValue = () => {},
  setBoundaryArea = () => {},
}) {
  const targetRef = React.useRef(null);
  const moveableRef = React.useRef(null);

  React.useEffect(() => {
    if (moveableRef.current) {
      var frame = framer.createFrame(targetRef.current);
      if (boundaryArea && boundaryArea.rotation) {
        moveableRef.current.moveable.rotation = boundaryArea.rotation;
        frame.transform.rotate = boundaryArea.rotation;
        moveableRef.current.moveable.request(
          "rotatable",
          { rotate: boundaryArea.rotation },
          true
        );
      }

      if (
        boundaryArea &&
        boundaryArea.offsetHeight &&
        boundaryArea.offsetWidth
      ) {
        frame.dimensions.width = boundaryArea.offsetWidth;
        frame.dimensions.height = boundaryArea.offsetHeight;
        moveableRef.current.moveable.request(
          "resizable",
          {
            offsetWidth: boundaryArea.offsetWidth,
            offsetHeight: boundaryArea.offsetHeight,
          },
          true
        );
      }

      if (boundaryArea && boundaryArea.x && boundaryArea.y) {
        moveableRef.current.moveable.request(
          "draggable",
          { x: boundaryArea.x, y: boundaryArea.y },
          true
        );
      }

      moveableRef.current.moveable.updateRect();
      moveableRef.current.moveable.updateTarget();
    }
  }, [targetRef]);

  if (!boundaryArea || Object.keys(boundaryArea).length === 0) {
    return null;
  }
  const s = boundaryArea;
  const transform = `rotate(${s.rotation || 0}deg)`;

  function onMeasureEdge(e) {
    const padding = Math.max(30, e.target.offsetWidth * 0.05);
    const value = posToValue(
      e.nativeEvent.offsetX,
      padding,
      e.target.offsetWidth,
      boundaryArea.minValue,
      boundaryArea.maxValue
    );
    setValue(value);
  }
  return (
    <div style={{ "--able-color": color }}>
      <div
        className="target"
        ref={targetRef}
        style={{
          transform: transform,
          top: boundaryArea.y,
          left: boundaryArea.x,
          width: s.offsetWidth + "px",
          height: s.offsetHeight + "px",
        }}
      ></div>
      <Moveable
        ref={moveableRef}
        target={targetRef}
        ables={[
          DimensionViewable,
          LabelLeftViewable,
          LabelRightViewable,
          EdgeClickable,
        ]}
        props={{
          dimensionViewable: true,
          LabelLeftViewable: true,
          LabelRightViewable: true,
          EdgeClickable: true,
          measureEdge: value,
          displayName: displayName,
          valueLeft: boundaryArea.minValue,
          valueRight: boundaryArea.maxValue,
          onValueRight: (e) => {
            if (e.target.validity.valid) {
              setBoundaryArea({
                ...boundaryArea,
                maxValue: parseFloat(e.target.value),
              });
            }
          },
          onValueLeft: (e) => {
            if (e.target.validity.valid) {
              setBoundaryArea({
                ...boundaryArea,
                minValue: parseFloat(e.target.value),
              });
            }
          },
          onMeasureEdge: onMeasureEdge,
        }}
        renderDirections={["n", "s", "w", "e"]}
        origin={false}
        draggable={!disabled}
        resizable={!disabled}
        rotatable={!disabled}
        onDragStart={(e) => {
          framer.onDragStart(e);
        }}
        onDrag={(e) => {
          framer.onDrag(e);
        }}
        onDragEnd={(e) => {
          const translate = framer.getTranslate(e.target);

          const newX = (boundaryArea.x || 0) + translate.x;
          const newY = (boundaryArea.y || 0) + translate.y;
          setBoundaryArea({ ...boundaryArea, x: newX, y: newY });
        }}
        onResizeStart={framer.onResizeStart}
        onResize={framer.onResize}
        onResizeEnd={(e) => {
          const translate = framer.getTranslate(e.target);
          const newX = (boundaryArea.x || 0) + translate.x;
          const newY = (boundaryArea.y || 0) + translate.y;
          setBoundaryArea({
            ...boundaryArea,
            y: newY,
            x: newX,
            offsetHeight: e.lastEvent.offsetHeight,
            offsetWidth: e.lastEvent.offsetWidth,
          });
        }}
        onRotateStart={framer.onRotateStart}
        onRotate={framer.onRotate}
        onRotateEnd={(e) => {
          if (!boundaryArea.rotation) {
            setBoundaryArea({
              ...boundaryArea,
              rotation: e.lastEvent.rotate,
            });
          } else if (
            Math.abs(boundaryArea.rotation - e.lastEvent.rotate) > 0.001
          ) {
            setBoundaryArea({
              ...boundaryArea,
              rotation: e.lastEvent.rotate,
            });
          }
        }}
      />
    </div>
  );
}

MovableLineMeasureArea.propTypes = {
  color: PropTypes.string,
  displayName: PropTypes.string,
  measureValues: PropTypes.object,
  disabled: PropTypes.bool,
  value: PropTypes.number,
  setValue: PropTypes.func,
  setMeasureValues: PropTypes.func,
};
