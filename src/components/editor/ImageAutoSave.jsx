import React from "react";
import "./ImageAutoSave.css";

export default function ImageAutoSave({ isAutoSaving }) {
  if (!isAutoSaving) return;

  return (
    <div className="image-autosave">
      <div className="loader"></div>
    </div>
  );
}
