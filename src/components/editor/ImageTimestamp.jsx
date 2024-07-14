import React from "react";
import * as dayjs from "dayjs";
import "./ImageTimestamp.css";

export default function ImageTimestamp({ imageDate }) {
  return (
    <div className="image-timestamp">
      {dayjs.unix(imageDate).format("YYYY-MM-DD HH:mm:ss")}
    </div>
  );
}
