import React from "react";
import LoadProjectButton from "../components/toolbar/LoadProjectButton.jsx";
import ReadFolderButton from "../components/toolbar/ReadFolderButton.jsx";
import "./SetupPage.css";

export default function SetupPage() {
  return (
    <div className="setup-page-container">
      <div>
        <p>
          Start a measurement project by either loading a project file or
          reading a folder containing an image sequence
        </p>
        <LoadProjectButton />
        <ReadFolderButton />
      </div>
    </div>
  );
}
