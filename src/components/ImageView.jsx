import React, {useState, useEffect, useContext } from "react";
import { MovableFluidArea } from "./MovableFluidArea.jsx";
import { ImageMoverArea } from "./ImageMoverArea.jsx";
import { useKeypress } from "./utils/KeypressHook.jsx";
import { Link, useParams  } from "react-router-dom";
import { store } from '../store.js';

export default function ImageView() {
    let { guid } = useParams();
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    const image = state.images[guid];
    const [imageMode, setImageMode] = useState(false);
    console.log(guid);
    console.log(image);
    useEffect(() => {
        window.getImage(image.path).then(content => {
            const url = URL.createObjectURL( new Blob([content.buffer], { type: "image/png" }) );
            const img = document.getElementById("image-container");
            const rotate = true;
            if (rotate) {
                img.style.transform = "rotate(90deg) translatex(-50%)";
            }
            img.src = url;
            img.onload = (e) => {
                img.width = window.innerWidth;
                URL.revokeObjectURL(url)
            };
        });
    }, [image.path]);

    useKeypress("q", () => {
        setImageMode(!imageMode)
    }, [imageMode]);


    return (
        <div className="image-container" style={{  overflow: "hidden"}}>
            <div className="top-bar">
                <Link to="/">Overview</Link>
                {image.prevId ? <Link to={"/image/" + image.prevId }>prev</Link> : null }
                {image.nextId ? <Link to={"/image/" + image.nextId }>next</Link> : null }
                <label>Move image</label>
                <input type="checkbox" 
                    checked={imageMode} 
                    onChange={e => setImageMode(!imageMode)} />
            </div>
            <ImageMoverArea imageMode={imageMode}>
                <MovableFluidArea name="og" displayName="O/G" color="red" position="left" disabled={imageMode}></MovableFluidArea>
                <MovableFluidArea name="ow" displayName="O/W" color="blue"  position="right" disabled={imageMode}></MovableFluidArea>
                <img id="image-container"></img>
            </ImageMoverArea>
        </div>
    );
}