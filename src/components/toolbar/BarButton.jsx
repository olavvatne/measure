import React from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { ICON_SIZE } from "./config";

export default function BarButton({ path, children, tooltip }) {
  let navigate = useNavigate();
  const active = useMatch(path) ? "active" : null;

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { size: ICON_SIZE });
    }
    return child;
  });

  return (
    <button
      title={tooltip}
      onMouseDown={() => navigate(path)}
      className={active}
    >
      {childrenWithProps}
    </button>
  );
}
