import { join } from 'path'

// store-ipc
import { storeIpc } from './ipc/index'

// image
import appIcon from '../../resources/image/L.L.ico?asset'

const http = require('http')

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: appIcon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: appIcon
  })

  mainWindow.webContents.toggleDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  function onRequest(client_req, client_res) {
    const proxyUrl = '/api/v3' + client_req.url
    console.log('New request:', client_req.method, proxyUrl)

    const options = {
      hostname: 'www.zhihu.com', // 这里是你的代理服务器地址
      port: 443,
      path: '/api/v3/' + client_req.url,
      method: client_req.method,
      headers: client_req.headers
    }

    const proxy = http.request(options, function (res) {
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res, {
        end: true
      })
    })
    console.log(proxy)
    client_req.pipe(proxy, {
      end: true
    })
  }

  http.createServer(onRequest).listen(5172)

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

  const mainWindow = createWindow()

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

app.on('will-quit', () => {})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
