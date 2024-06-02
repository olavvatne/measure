import { ArrowLeftIcon, ArrowRightIcon, LockIcon, RowsIcon, SearchIcon } from '@primer/octicons-react';
import * as dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageMoverArea } from "../components/ImageMoverArea.jsx";
import { MovableFluidArea } from "../components/MovableFluidArea.jsx";
import { store } from '../store.js';
import { useKeypress } from "../utils/KeypressHook.jsx";

const nextTooltip = "Go to the next image";
const previousTooltip = "Go to the previous image";
const viewTooltip = "Image can be zoomed and moved if toggled on to green. "
    + "If toggled off you can modify the measuring widgets";
const menuTooltip = "Go back to overview";
const lockTooltip = "Lock mode disabled movement of widgets";

export default function ImagePage() {
    let { guid } = useParams();
    const globalState = useContext(store);
    const { dispatch, state } = globalState;
    let navigate = useNavigate();
    const image = state.images[guid] || {};
    const [imageMode, setImageMode] = useState(false);
    const [lockMode, setLockMode] = useState(false);
    const [fluidValues, setFluidValues] = useState({og: image.values?.og, ow: image.values?.ow});
    const [measure, setMeasure] = useState({og: state?.currentMeasurer.og, ow: state?.currentMeasurer.ow});


    useEffect(() => {
        if (!window.imageApi.getImage) return;

        const dateUnix = image.date;
        dispatch({ type: "SetCurrentMeasurerAction", data: {dateUnix} });
        window.imageApi.getImage(image.path).then(content => {
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
        setFluidValues({og: image.values?.og, ow: image.values?.ow});
    }, [image.id, JSON.stringify(state.images[guid])])

    useKeypress("q", () => {
        setImageMode(!imageMode)
    }, [imageMode]);

    useKeypress("w", () => {
        setLockMode(!lockMode)
    }, [lockMode]);


    useKeypress("ArrowRight", () => {
        next();
    }, [image.id, image, measure, fluidValues]);

    useKeypress("ArrowLeft", function() {
        prev();
    }, [image.id, image, measure, fluidValues]);

    function navigateTo(navUrl) {
        const mv = measure;
        const fv = fluidValues;
        const ci = image;

        const ogData = {dateUnix: ci.date, name: "og", values: mv.og, id: ci.id, recordedValues: fv};
        const owData = {dateUnix: ci.date, name: "ow", values: mv.ow, id: ci.id, recordedValues: fv};
        const data = {og: ogData, ow: owData};
        if (ogData.dateUnix || owData.dateUnix) {
            dispatch({ type: "NewMeasureValuesAction", data});
        }

        navigate(navUrl);
    }

    function next() {
        if (image.nextId) {
            navigateTo("/image/" + image.nextId);
        }
    }

    function prev() {
        if (image.prevId) {
            navigateTo("/image/" + image.prevId);
        }
    }

    function overview() {
        navigateTo("/");
    }
    const buttonStyle = ""
    return (
        <div className="image-container">
            <div className="top-bar">
                <button title={menuTooltip} className={buttonStyle} onClick={overview}>
                    <RowsIcon size={16} />
                </button>
                <div>
                    <button title={viewTooltip} 
                        className={imageMode ? "primary-button" : "secondary-button"}
                            onClick={() => setImageMode(!imageMode)}>
                        <SearchIcon size={16} />
                    </button>
                    <button title={lockTooltip} 
                        className={lockMode ? "primary-button" : "secondary-button"}
                            onClick={() => setLockMode(!lockMode)}>
                        <LockIcon size={16} />
                    </button>
                </div>
                <div className="controls">
                    {image.prevId ? 
                        <button title={previousTooltip}  
                                className={"controls-prev " + buttonStyle} 
                                onClick={prev}>
                            <ArrowLeftIcon size={16} />
                        </button> 
                    : null }
                    {image.nextId ? 
                        <button title={nextTooltip} 
                                className={"controls-next " + buttonStyle} 
                                onClick={next}>
                            <ArrowRightIcon size={16} />
                        </button> 
                    : null }
                </div>
                <div className="date-area">{dayjs.unix(image.date).format("YYYY-MM-DD HH:mm:ss")}</div>
            </div>
            <ImageMoverArea imageMode={imageMode}>
                <MovableFluidArea 
                    key={JSON.stringify(measure.og) + JSON.stringify(fluidValues.og || null) + image.id + "og"}
                    imageId={image.id}
                    name="og"
                    displayName="O/G" 
                    color="red" 
                    position="left" 
                    disabled={imageMode || lockMode} 
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
                    disabled={imageMode || lockMode}
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
