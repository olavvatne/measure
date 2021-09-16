const { ipcRenderer, contextBridge, remote } = require('electron');

contextBridge.exposeInMainWorld("imageApi", {
    openDialog: () =>  ipcRenderer.invoke( 'app:on-fs-dialog-open' ),
    getImage: (imgPath) =>  ipcRenderer.invoke( 'app:on-fs-image-open', imgPath),
});

contextBridge.exposeInMainWorld("fileApi", {
    storeJson: (json) =>  ipcRenderer.invoke( 'app:on-fs-json-store', json),
    loadJson: () =>  ipcRenderer.invoke( 'app:on-fs-json-load'),
});

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    // system: () => ipcRenderer.invoke('dark-mode:system'),
    current: () => ipcRenderer.invoke('dark-mode:current'),
    onUpdated: callback =>  ipcRenderer.on('dark-mode-updated', callback)
  })
