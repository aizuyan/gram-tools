const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron');
const Menu = electron.Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 960,
    height: 600,
    minWidth: 768,
    minHeight: 480,
    fullscreenable: true,
    autoHideMenuBar: true    
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
 // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
     // Create the Application's main menu
  let template = [{
      label: 'Edit',
      submenu: [
          {
              label: 'Undo',
              accelerator: 'CmdOrCtrl+Z',
              selector: 'undo:',
              role: 'undo'
          },
          {
              label: 'Redo',
              accelerator: 'Shift+CmdOrCtrl+Z',
              selector: 'redo:',
              role: 'redo'
          },
          {
              type: 'separator'
          },
          {
              label: 'Cut',
              accelerator: 'CmdOrCtrl+X',
              selector: 'cut:',
              role: 'cut'
          },
          {
              label: 'Copy',
              accelerator: 'CmdOrCtrl+C',
              selector: 'copy:',
              role: 'copy'
          },
          {
              label: 'Paste',
              accelerator: 'CmdOrCtrl+V',
              selector: 'paste:',
              role: 'paste'
          },
          {
              label: 'Select All',
              accelerator: 'CmdOrCtrl+A',
              selector: 'selectAll:',
              role: 'selectall'
          }
      ]
  }];

    //注册菜单  
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
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
