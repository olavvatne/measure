import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ICON_SIZE } from "../toolbar/config";
import { useKeypress } from "../../utils/KeypressHook.jsx";

export default function ImageNavigateButton({
  path,
  children,
  tooltip,
  hotkey,
}) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  // Strange issue with keypress and react-route not rendering ImagePage,
  // even though loader triggers correctly. We therefore use a ref and activate the button
  // which for some reason do work.
  // Entire function can be replaced with navigate(path)
  useKeypress(
    hotkey,
    () => {
      if (buttonRef.current) {
        const event = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        buttonRef.current.dispatchEvent(event);
      }
    },
    [path]
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { size: ICON_SIZE });
    }
    return child;
  });

  return (
    <button ref={buttonRef} title={tooltip} onMouseDown={() => navigate(path)}>
      {childrenWithProps}
    </button>
  );
}
