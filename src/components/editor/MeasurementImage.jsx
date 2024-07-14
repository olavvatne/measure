import React, { useEffect } from "react";

export default function MeasurementImage({ imagePath }) {
  useEffect(() => {
    if (!window.imageApi.getImage) return;
    window.imageApi.getImage(imagePath).then((content) => {
      const url = URL.createObjectURL(
        new Blob([content.buffer], { type: "image/png" })
      );
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
        URL.revokeObjectURL(url);
      };
    });
  }, [imagePath]);

  return <img id="image-container"></img>;
}
