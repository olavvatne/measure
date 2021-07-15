import React, {useState, useEffect, useContext } from "react";
import { MovableFluidArea } from "./MovableFluidArea.jsx";
import { ImageMoverArea } from "./ImageMoverArea.jsx";
import { useKeypress } from "./utils/KeypressHook.jsx";
import { useParams  } from "react-router-dom";
import { store } from '../store.js';
import { useHistory } from "react-router-dom";

export default function ImageView() {
    let { guid } = useParams();
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    let history = useHistory();
    const image = state.images[guid] || {};
    const [imageMode, setImageMode] = useState(false);
    const [fluidValues, setFluidValues] = useState({});
    // const [owValue, setOwValue] = useState(null);
    if (!window.keepView) {
        window.keepView = true;
        window.measure = {og: state?.currentMeasurer.og, ow: state?.currentMeasurer.ow };
    }

    useEffect(() => {
        if (!window.getImage) return;
        // setOgValue(image.ogValue);
        setFluidValues({og: image.ogValue, ow: image.owValue});
        const dateUnix = image.date;
        dispatch({ type: "SetCurrentMeasurerAction", data: {dateUnix} });
        window.getImage(image.path).then(content => {
            const url = URL.createObjectURL( new Blob([content.buffer], { type: "image/png" }) );
            const img = document.getElementById("image-container");
            const rotate = true;
            if (rotate) {
                img.style.transform = "rotate(90deg) translatex(-50%)";
            }
            img.src = url;
            if (!window.firstWidth) {
                window.firstWidth = window.innerWidth;
            }
            img.style.width = window.firstWidth + "px";
            img.onload = () => {
                URL.revokeObjectURL(url)
            };
        });
    }, [image?.path]);

    useKeypress("q", () => {
        setImageMode(!imageMode)
    }, [imageMode]);

    useKeypress("ArrowRight", () => {
        next();
    }, [image.nextId]);

    useKeypress("ArrowLeft", () => {
        prev();
    }, [image.prevId]);

    function navigate(navUrl) {
        // Two dispatch after each other mess with function arguments.
        // Keep dispatch in same function / scope.
        window.keepView = false;
        const mv = JSON.parse(JSON.stringify(window.measure));
        const fv = JSON.parse(JSON.stringify(fluidValues));
        const ci = JSON.parse(JSON.stringify(image));
        const ogData = {dateUnix: ci.date, name: "og", values: mv.og, id: ci.id, recordedValues: fv};
        const owData = {dateUnix: ci.date, name: "ow", values: mv.ow, id: ci.id, recordedValues: fv};
        if (ogData.dateUnix) {
            dispatch({ type: "NewMeasureValuesAction", data: ogData});
        }
        if (owData.dateUnix) {
            dispatch({ type: "NewMeasureValuesAction", data: owData});
        }
        history.push(navUrl);
    }

    function next() {
        if (image.nextId) {
            navigate("/image/" + image.nextId);
        }
    }

    function prev() {
        if (image.prevId) {
            navigate("/image/" + image.prevId);
        }
    }

    function overview() {
        navigate("/");
    }

    return (
        <div className="image-container" style={{  overflow: "hidden"}}>
            <div className="top-bar">
                <button onClick={overview}>Overview</button>
                <div>
                    <label>Move image</label>
                    <input type="checkbox" 
                        checked={imageMode} 
                        onChange={e => setImageMode(!imageMode)} />
                </div>
                <div className="controls">
                    {image.prevId ? <button className="controls-prev" onClick={prev}>prev</button> : null }
                    {image.nextId ? <button className="controls-next" onClick={next}>next</button> : null }
                </div>
            </div>
            <ImageMoverArea imageMode={imageMode}>
                <MovableFluidArea 
                    key={JSON.stringify(window.measure.og) + JSON.stringify(fluidValues.og) + image.id + "og"}
                    imageId={image.id}
                    name="og"
                    displayName="O/G" 
                    color="red" 
                    position="left" 
                    disabled={imageMode} 
                    value={fluidValues.og}
                    setValue={v => setFluidValues({og: v, ow: fluidValues.ow})}
                    measureValues={window.measure.og}>

                </MovableFluidArea>
                <MovableFluidArea 
                    key={JSON.stringify(window.measure.ow) + JSON.stringify(fluidValues.ow) +  image.id + "ow"}
                    imageId={image.id} 
                    name="ow" displayName="O/W"
                    color="blue"
                    position="right"
                    disabled={imageMode}
                    value={fluidValues.ow}
                    setValue={v => setFluidValues({ow: v, og: fluidValues.og})}
                    measureValues={window.measure.ow}> 
                </MovableFluidArea>
                <img id="image-container"></img>
            </ImageMoverArea>
        </div>
    );
}