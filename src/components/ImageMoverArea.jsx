import React, { useContext, useEffect, useRef, useState } from 'react';
import { store } from '../store.js';

export function ImageMoverArea({imageMode, children}) {
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const zoomRef = useRef();
    const [imageLocation, setImageLocation] = useState({panning: false, start: {x: 0, y:0}})
    function setTransform(pointX, pointY, scale) {
        zoomRef.current.style.transform = `translate(${pointX}px, ${pointY}px)  scale(${scale})`;
    }
    // TOOD: keep own state and update store on exit from image instead
    useEffect(() => {
     let {pointX, pointY, scale } = state.view;
     setTransform(pointX, pointY, scale)   
    });

    function onZoom(e) {
        if (!imageMode) return;
        // e.preventDefault();
        let {pointX, pointY, scale } = state.view;
        var xs = (e.clientX - pointX) / scale,
          ys = (e.clientY - pointY) / scale,
          delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
        pointX = e.clientX - xs * scale;
        pointY = e.clientY - ys * scale;
        setTransform(pointX, pointY, scale);
        dispatch({ type: 'ViewChangeAction', data: {scale, pointX, pointY} });
        // setImageLocation({...imageLocation})
    }
    function onMouseDown(e) {
        if (!imageMode) return;
        e.preventDefault();
        let {pointX, pointY } = state.view;
        const start = { x: e.clientX - pointX, y: e.clientY - pointY };
        setImageLocation({...imageLocation, start, panning: true})
    }
    function onMouseUp(e) {
        if (!imageMode) return;
        e.preventDefault();
        setImageLocation({...imageLocation, panning: false})
    }
    function onMouseMove(e) {
        if (!imageMode) return;
        e.preventDefault();
        let {pointX, pointY, scale } = state.view;
        let {panning, start } = imageLocation;
        if (!panning) {
            return;
          }
          pointX = (e.clientX - start.x);
          pointY = (e.clientY - start.y);
          setTransform(pointX, pointY, scale);
          dispatch({ type: 'ViewChangeAction', data: {scale, pointX, pointY} });
        //   setImageLocation({...imageLocation, pointX, pointY})
    }

    return (
        <div id="zoom" ref={zoomRef} onWheel={onZoom} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
            {children}
        </div>
    );
}
