import { app, BrowserWindow, ipcMain } from 'electron';
import { directoryLoadingListeners, setupDirs } from './directories/game-files-loader';
import { buildMenu } from './menu';
import { serverStartup } from './server';
import { setupBase } from './directories/base';
import { setupCache } from './directories/cache';

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  mainWindow.maximize();

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.once('bootrstrap-cache', () => {
    setupCache();
    mainWindow?.webContents.send('cache-loading-end');
  });

  directoryLoadingListeners();
}

app.on('ready', createWindow)
  .whenReady()
  .then(serverStartup)
  .then(registerListeners)
  .then(setupDirs)
  .then(buildMenu)
  .then(setupBase)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// app.commandLine.appendSwitch('ignore-certificate-errors');
