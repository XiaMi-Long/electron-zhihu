import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

const installApp = function () {
  autoUpdater.quitAndInstall()
  app.quit()
}

export { installApp }
