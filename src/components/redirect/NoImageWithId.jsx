import React from "react";
import { Link } from "react-router-dom";
import "./NoProjectLoaded.css";

export default function NoImageWithId() {
  return (
    <div className="centered-message-container">
      <p>
        No image mathing guid in store,{" "}
        <Link to="/overview">go back to overview</Link>
      </p>
    </div>
  );
}
