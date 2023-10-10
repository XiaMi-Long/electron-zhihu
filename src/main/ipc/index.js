import { ipcMain } from 'electron'

import { openExternal } from '../module/shell'
import { getStore, delStore, hasStore, setStore } from '../module/store'
import { recommend, getArticleDetails, getArticleDetailsByPage } from '../api/index'

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
  ipcMain.handle('http:getArticleDetailsByPage', getArticleDetailsByPage)
}

const shells = function () {
  ipcMain.on('shell:openExternal', openExternal)
}

export { storeIpc, http, shells }
