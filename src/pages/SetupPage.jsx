import React from "react";
import LoadProjectButton from "../components/toolbar/LoadProjectButton.jsx";
import ReadFolderButton from "../components/toolbar/ReadFolderButton.jsx";
import "./SetupPage.css";

export default function OverviewPage() {
  return (
    <>
      <LoadProjectButton />
      <ReadFolderButton />
    </>
  );
}
