const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        request: (channel, data) => {
          // whitelist channels
          const validChannels = [
            "toMain",
            "save:files",
            "save:files:one",
            "save:qrCodes",
            "save:qrCodes:one",
            "upload:files",
            "upload:qrCodes",
          ];
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
        },
        receive: (channel, func) => {
          const validChannels = [
            "fromMain",
            "upload:reply",
            "upload:cancel",
          ];
          if (validChannels.includes(channel)) {
              // Deliberately strip event as it includes `sender`
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
        }
    }
);
