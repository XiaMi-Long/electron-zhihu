import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  store: {
    get: (key) => ipcRenderer.invoke('store:get-store', key),
    set: (key, value) => ipcRenderer.send('store:set-store', key, value),
    has: (key) => ipcRenderer.invoke('store:has-store', key),
    del: (key) => ipcRenderer.send('store:delete-store', key)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
