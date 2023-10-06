import { ipcMain } from 'electron'

import { recommend, getArticleDetails } from '../api/index'
import { getStore, delStore, hasStore, setStore } from '../module/store'

const storeIpc = function () {
  //  store
  ipcMain.handle('store:get-store', getStore)

  ipcMain.on('store:set-store', setStore)

  ipcMain.handle('store:has-store', hasStore)

  ipcMain.on('store:delete-store', delStore)
}

const http = function () {
  ipcMain.handle('http:recommend', recommend)
  ipcMain.handle('http:getArticleDetails', getArticleDetails)
}

export { storeIpc, http }
