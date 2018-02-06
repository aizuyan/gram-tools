const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron');
const Menu = electron.Menu;

const Tray = require("./js/tray/Tray"); // 托盘图标


let win = null;
let contents = null;
let isTrayInit = false;
let willQuitApp = false;

// 判断是不是第二个实例，第二个实例执行到这里显示之前的窗口
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})
if (isSecondInstance) {
  app.quit()
}

// 创建窗口
function createWin () {
  // 创建主窗口
  win = new BrowserWindow({
    width: 960,
    height: 600,
    minWidth: 768,
    minHeight: 480,
    fullscreenable: true,
    autoHideMenuBar: true    
  })

  contents = win.webContents;

  // 内容加在完毕之后，设置托盘图标
  contents.on('did-finish-load', () => {
    if (!isTrayInit) {
      Tray.InitTray(app, win);
      isTrayInit = true
    }
  })  

  // 加载app首页面
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
  }))

  // 关闭的时候可能只是想最小化
  win.on('close', (e) => {
    if (willQuitApp) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  });

  // 窗口已经关闭的时候销毁
  win.on('closed', () => {
    win = null
    contents = null
  })

  // Open the DevTools.
  //contents.openDevTools()
}
app.on('ready', function() {
  createWin();
});

/**
 * 添加一个展示时间，通过emit调用
 */
app.on('show', function () {
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.show()
  } else {
    createWin()
  }
})

// mac下面点击关闭，最小化到docker中，再次点击恢复
app.on('activate', function () {
  if (!win) {
    createWin()
  } else if (win.isMinimized()) {
    win.restore()
  } else {
    win.show()
  }
})

// 真正的退出
app.on('before-quit', () => willQuitApp = true)

app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') {
   // app.quit();
  //}
})



const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('select-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  }, function (files) {
    if (files) event.sender.send('select-file-paths', files)
  })
})

ipc.on('select-single-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) event.sender.send('select-file-path', files)
  })
})

ipc.on('save-file-dialog', function (event) {
  dialog.showSaveDialog({
    "title": "保存合并文件位置",
  }, function (fullPath) {
    if (fullPath) event.sender.send('save-file-path', fullPath)
  })
})

ipc.on('get-app-path', function (event) {
  event.sender.send('got-app-path', app.getAppPath())
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
