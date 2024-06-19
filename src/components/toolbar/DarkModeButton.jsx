import { Moon, Sun } from "@phosphor-icons/react";
import React, { useState } from "react";
import { isDarkTheme, setTheme } from "../../utils/dark-mode";
import { isElectron } from "../../utils/platform-util";
import { ICON_SIZE } from "./config";

const darkModeTooltip = "Toggle between dark and light theme";

export default function DarkModeButton() {
  const [isDarkMode, setIsDarkMode] = useState(isDarkTheme());
  async function toggleDarkMode() {
    let isDark = false;
    if (isElectron()) {
      isDark = await window.darkMode.toggle();
    } else {
      isDark = isDarkTheme();
    }
    setTheme(!isDark);
    setIsDarkMode(isDark);
  }
  return (
    <button title={darkModeTooltip} onClick={toggleDarkMode}>
      {isDarkMode ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
    </button>
  );
}
