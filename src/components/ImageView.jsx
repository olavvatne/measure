import React, {useState, useEffect, useContext } from "react";
import { MovableFluidArea } from "./MovableFluidArea.jsx";
import { ImageMoverArea } from "./ImageMoverArea.jsx";
import { useKeypress } from "./utils/KeypressHook.jsx";
import { Link, useParams  } from "react-router-dom";
import { store } from '../store.js';
import Moment from "moment";
import { useHistory } from "react-router-dom";

export default function ImageView() {
    let { guid } = useParams();
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    let history = useHistory();
    const image = state.images[guid] || {};
    const [imageMode, setImageMode] = useState(false);
    window.measure = {og: state?.currentMeasurer.og, ow: state?.currentMeasurer.ow };

    useEffect(() => {
        if (!window.getImage) return;
        const dateUnix = Moment(image.date).unix();
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
            img.onload = (e) => {
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

    function onUpdate(name, values) {
        if (!values || Object.entries(values).length ===0 ) return; 
        const dateUnix = Moment(image.date).unix();
        dispatch({ type: "NewMeasureValuesAction", data: {dateUnix, name , values }});
    }

    function next() {
        if (image.nextId) {
            onUpdate("og", window.measure.og)
            onUpdate("ow", window.measure.ow)
            history.push("/image/" + image.nextId);
        }
    }

    function prev() {
        if (image.prevId) {
            onUpdate("og", window.measure.og)
            onUpdate("ow", window.measure.ow)
            history.push("/image/" + image.prevId);
        }
    }

    function overview() {
        onUpdate("og", window.measure.og)
        onUpdate("ow", window.measure.ow)
        history.push("/");
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
                    key={JSON.stringify(window.measure.og) + image.id}
                    imageId={image.id}
                    name="og"
                    displayName="O/G" 
                    color="red" 
                    position="left" 
                    disabled={imageMode} 
                    measureValues={window.measure.og}>

                </MovableFluidArea>
                <MovableFluidArea 
                    key={JSON.stringify(window.measure.ow) + image.id}
                    imageId={image.id} 
                    name="ow" displayName="O/W"
                    color="blue"
                    position="right"
                    disabled={imageMode}
                    measureValues={window.measure.ow}> 
                </MovableFluidArea>
                <img id="image-container"></img>
            </ImageMoverArea>
        </div>
    );
}