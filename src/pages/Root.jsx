import React from "react";
import { Outlet } from "react-router-dom";
import { BarButton } from "../components/toolbar";
import "./Root.css";
import { Export, GearSix, Plus, Stack } from "@phosphor-icons/react";

export default function Root() {
  return (
    <>
      <div className="app-sidebar">
        <div>
          <BarButton path="/" tooltip={"Setup a new measurement project"}>
            <Plus />
          </BarButton>
          <BarButton path="overview" tooltip={"Measure data in image sequence"}>
            <Stack />
          </BarButton>
          <BarButton path="export" tooltip={"Export options"}>
            <Export />
          </BarButton>
        </div>
        <BarButton path="settings" tooltip={"Settings"}>
          <GearSix />
        </BarButton>
      </div>
      <div className="app-content">
        <Outlet />
      </div>
    </>
  );
}
