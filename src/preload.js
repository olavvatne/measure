const { ipcRenderer, contextBridge, remote } = require('electron');

contextBridge.exposeInMainWorld("fileApi", {
    openDialog: () =>  ipcRenderer.invoke( 'app:on-fs-dialog-open' ),
    getImage: (imgPath) =>  ipcRenderer.invoke( 'app:on-fs-image-open', imgPath),
});

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    // system: () => ipcRenderer.invoke('dark-mode:system'),
    current: () => ipcRenderer.invoke('dark-mode:current'),
    onUpdated: callback =>  ipcRenderer.on('dark-mode-updated', callback)
  })
