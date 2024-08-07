const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeTheme,
  Menu,
  protocol,
} = require("electron");
const fs = require("fs");
const path = require("path");
var exifr = require("exifr");
const { promisify } = require("util");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let measureWindow = null;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Measure",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
  measureWindow = mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const readDirAsync = promisify(fs.readdir);

ipcMain.handle("app:on-fs-dialog-open", async () => {
  const dirs = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });
  const files = [];
  if (dirs.length > 0) {
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const dirFiles = await readDirAsync(dir);
      let imgFiles = dirFiles.filter((el) => {
        return (
          path.extname(el).toLowerCase() === ".jpg" ||
          path.extname(el).toLowerCase() === ".jpeg" ||
          path.extname(el).toLowerCase() === ".png"
        );
      });
      imgFiles = imgFiles.map((f) => path.join(dir, f));
      for (let j = 0; j < imgFiles.length; j++) {
        let date = null;
        const exiRes = await exifr.parse(imgFiles[j], ["DateTimeOriginal"]);
        if (exiRes) {
          const { DateTimeOriginal } = exiRes;
          date = DateTimeOriginal;
        } else {
          const imgStats = fs.statSync(imgFiles[j]);
          date = imgStats.birthtime;
        }

        files.push({
          path: imgFiles[j],
          date: date,
          // thumbnail: thumbnail,
        });
      }
    }
  }
  return files;
});

const readFileAsync = promisify(fs.readFile);
ipcMain.handle("app:on-fs-image-open", async (_, imgPath) => {
  var image = await readFileAsync(imgPath);
  return image;
});

ipcMain.handle("app:on-fs-json-store", async (_, json) => {
  dialog
    .showSaveDialog({
      title: "Store application data",
      buttonLabel: "Save",
      filters: [{ name: "Json", extensions: ["json"] }],
    })
    .then((file) => {
      if (!file.canceled) {
        fs.writeFile(file.filePath.toString(), json, (err) => {
          if (err) throw err;
        });
      }
    })
    .catch((err) => {
      console.err(err);
    });
});

ipcMain.handle("app:on-fs-json-load", async (_) => {
  return dialog
    .showOpenDialog({
      title: "Load application data",
      buttonLabel: "Load",
      properties: ["openFile"],
      filters: [{ name: "Json", extensions: ["json"] }],
    })
    .then((file) => {
      if (!file.canceled) {
        var data = fs.readFileSync(file.filePaths[0], "utf8");
        return data;
      }
    })
    .catch((err) => {
      console.err(err);
    });
});

ipcMain.handle("dark-mode:current", () => {
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  measureWindow.webContents.send(
    "dark-mode-updated",
    nativeTheme.shouldUseDarkColors
  );
  return nativeTheme.shouldUseDarkColors;
});

if (process.env.NODE_ENV === "development") {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "http",
      privileges: {
        standard: true,
        bypassCSP: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
      },
    },
    {
      scheme: "https",
      privileges: {
        standard: true,
        bypassCSP: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
      },
    },
    { scheme: "mailto", privileges: { standard: true } },
  ]);
}
