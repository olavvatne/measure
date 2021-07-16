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
    const [fluidValues, setFluidValues] = useState({og: image.ogValue, ow: image.owValue});
    const [measure, setMeasure] = useState({og: state?.currentMeasurer.og, ow: state?.currentMeasurer.ow});


    useEffect(() => {
        if (!window.getImage) return;

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

    useEffect(() => {
        setMeasure({og: state?.currentMeasurer.og, ow: state?.currentMeasurer.ow });
    }, [image.id, JSON.stringify(state.currentMeasurer)])

    useEffect(() => {
        setFluidValues({og: image.ogValue, ow: image.owValue});
    }, [image.id, JSON.stringify(state.images[guid])])

    useKeypress("q", () => {
        setImageMode(!imageMode)
    }, [imageMode]);

    useKeypress("ArrowRight", () => {
        next();
    }, [image.id, image, measure, fluidValues]);

    useKeypress("ArrowLeft", function() {
        prev();
    }, [image.id, image, measure, fluidValues]);

    function navigate(navUrl) {
        const mv = measure;
        const fv = fluidValues;
        const ci = image;

        const ogData = {dateUnix: ci.date, name: "og", values: mv.og, id: ci.id, recordedValues: fv};
        const owData = {dateUnix: ci.date, name: "ow", values: mv.ow, id: ci.id, recordedValues: fv};
        const data = {og: ogData, ow: owData};
        if (ogData.dateUnix || owData.dateUnix) {
            dispatch({ type: "NewMeasureValuesAction", data});
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
                    key={JSON.stringify(measure.og) + JSON.stringify(fluidValues.og || null) + image.id + "og"}
                    imageId={image.id}
                    name="og"
                    displayName="O/G" 
                    color="red" 
                    position="left" 
                    disabled={imageMode} 
                    value={fluidValues.og}
                    setValue={v => setFluidValues({og: v, ow: fluidValues.ow})}
                    measureValues={measure.og}
                    setMeasureValues={v => setMeasure({og: v, ow: measure.ow})}>

                </MovableFluidArea>
                <MovableFluidArea 
                    key={JSON.stringify(measure.ow) + JSON.stringify(fluidValues.ow || null) +  image.id + "ow"}
                    imageId={image.id} 
                    name="ow" displayName="O/W"
                    color="blue"
                    position="right"
                    disabled={imageMode}
                    value={fluidValues.ow}
                    setValue={v => setFluidValues({ow: v, og: fluidValues.og})}
                    measureValues={measure.ow}
                    setMeasureValues={v => setMeasure({ow: v, og: measure.og})}> 
                </MovableFluidArea>
                <img id="image-container"></img>
            </ImageMoverArea>
        </div>
    );
}