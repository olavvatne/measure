import {useEffect} from "react";

export function useKeypress(key, action, refreshArray) {
    useEffect(() => {
      function onKeyup(e) {
        if (e.key === key) action()
      }
      window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }, refreshArray);
  }