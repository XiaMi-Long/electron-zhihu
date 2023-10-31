import { autoUpdater } from 'electron-updater'

export function checkUpdate(mainWindow) {
  //检测更新
  autoUpdater.checkForUpdates()

  // 开始检测更新的时候
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('app-checking-for-update')
  })

  // 当没有可用更新的时候触发
  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('app-update-not-available')
  })

  //监听'error'事件
  autoUpdater.on('error', () => {
    mainWindow.webContents.send('app-update-error')
  })

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('app-update-available')
  })

  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('app-update-downloaded')
  })
}
