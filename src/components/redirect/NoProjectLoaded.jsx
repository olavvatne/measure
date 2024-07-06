import React from "react";
import { Link } from "react-router-dom";
import "./NoProjectLoaded.css";

export default function NoProjectLoaded() {
  return (
    <div className="centered-message-container">
      <p>
        Nothing to see here yet,{" "}
        <Link to="/">set up new project here first</Link>
      </p>
    </div>
  );
}
