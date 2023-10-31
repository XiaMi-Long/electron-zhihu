import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  store: {
    get: (key) => ipcRenderer.invoke('store:get-store', key),
    set: (key, value) => ipcRenderer.send('store:set-store', key, value),
    has: (key) => ipcRenderer.invoke('store:has-store', key),
    del: (key) => ipcRenderer.send('store:delete-store', key)
  },
  http: {
    getRecommend: (params) => ipcRenderer.invoke('http:recommend', params),
    getArticleDetails: (questionId, params, cookie) =>
      ipcRenderer.invoke('http:getArticleDetails', questionId, params, cookie),
    getArticleDetailsByPage: (url, cookie) =>
      ipcRenderer.invoke('http:getArticleDetailsByPage', url, cookie)
  },
  shell: {
    openExternal: (url) => ipcRenderer.send('shell:openExternal', url)
  },
  app: {
    onInstallApp: () => ipcRenderer.send('install-app'),
    onAppUpdateError: (callBack) => ipcRenderer.on('app-update-error', callBack),
    onAppUpdateAvailable: (callBack) => ipcRenderer.on('app-update-available', callBack),
    onAppUpdateDownloaded: (callBack) => ipcRenderer.on('app-update-downloaded', callBack),
    onAppCheckingForUpdate: (callBack) => ipcRenderer.on('app-checking-for-update', callBack),
    onAppUpdateNotAvailable: (callBack) => ipcRenderer.on('app-update-not-available', callBack)
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
