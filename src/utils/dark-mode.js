import { isElectron } from "../utils/platform-util";

export function isDarkTheme() {
  if (isElectron()) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return document.documentElement.getAttribute("data-theme") == "dark";
}

export function detectColorScheme() {
  var theme = "light";

  if (!window.matchMedia) {
    //matchMedia method not supported
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    var theme = "dark";
  }

  if (theme == "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

export function setTheme(isDark) {
  if (isElectron()) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } else {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }
}
