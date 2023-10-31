import { join } from 'path'

// store-ipc
import { storeIpc, http, shells, appInstall } from './ipc/index'

// image
import appIcon from '../../resources/image/e.ico?asset'

// http
import { startLogging, stopLogging } from './utils/http'

// update
import { checkUpdate } from './utils/electron-update'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, Tray, Menu, nativeImage } from 'electron'

function createWindow(loadingWindow) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: true,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: appIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: appIcon
  })

  setTimeout(() => {
    mainWindow.webContents.toggleDevTools()
  }, 3000)

  mainWindow.on('ready-to-show', () => {
    loadingWindow.close()
    loadingWindow = null
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

function createLoadingWindow() {
  const loadingWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: true,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: appIcon } : {}),
    icon: appIcon
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loadingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/loading.html`)
  } else {
    loadingWindow.loadFile(join(__dirname, '../renderer/loading.html'))
  }

  loadingWindow.on('ready-to-show', () => {
    loadingWindow.show()
  })

  return loadingWindow
}

app.whenReady().then(async () => {
  await startLogging()
  let loadingWindow = createLoadingWindow()

  const appTray = new Tray(nativeImage.createFromPath(appIcon))
  // 监听点击托盘图标事件
  // 点击托盘图标时显示/隐藏应用窗口
  appTray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // 初始化store的ipc通信
  storeIpc()
  // 初始化http请求的ipc通信
  http()
  // 初始化使用sheel的操作方法
  shells()
  // 初始化应用更新的方法
  appInstall()

  const mainWindow = createWindow(loadingWindow)
  //每次启动程序，就检查更新
  checkUpdate(mainWindow)

  const mainWindowCloseHandler = (event) => {
    if (process.platform !== 'darwin') {
      event.preventDefault()
      mainWindow.hide()
    }
  }

  mainWindow.on('close', mainWindowCloseHandler)

  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        // 在退出之前解除主窗口的'close'事件监听
        mainWindow.removeListener('close', mainWindowCloseHandler)
        app.quit()
      }
    }
  ])
  appTray.setContextMenu(contextMenu)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', async () => {
  await stopLogging()
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
