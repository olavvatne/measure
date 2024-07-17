import React, { createContext, useState } from "react";
import { createHash } from "../utils/guid";
import * as dayjs from "dayjs";

const ImagesContext = createContext();

const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState({});

  async function loadImages(files) {
    var data = {};
    for (let i = 0; i < files.length; i++) {
      const guid = await createHash(files[i].path);
      const nextId =
        i >= files.length - 1 ? null : await createHash(files[i + 1].path);
      const prevId = i <= 0 ? null : await createHash(files[i - 1].path);
      data[guid] = {
        id: guid,
        path: files[i].path,
        date: dayjs(files[i].date).unix(),
        nextId,
        prevId,
      };
    }
    setImages(data);
  }

  return (
    <ImagesContext.Provider value={{ images, setImages, loadImages }}>
      {children}
    </ImagesContext.Provider>
  );
};

export { ImagesContext, ImagesProvider };
