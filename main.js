// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog } = require('electron')
const ipc = require("electron").ipcMain;
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // remove menu
  Menu.setApplicationMenu(null)

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1366, height: 768 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //read song.txt to get the path and list the songs
  mainWindow.webContents.on('did-finish-load', function() {
    fs.readFile("./songs.txt", 'utf-8', function (err, data) {
      if (!err) {
        mainWindow.webContents.send("init-path", data);
      }
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//添加音乐目录
ipc.on("add-music-dir", function (event, arg) {
  dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, function (path) {
    if (path) {
      event.returnValue = path[0];
      fs.writeFile("./songs.txt", path, function (err) {
        if (err) {
          console.log("error" + err.message);
        }
      });
    }
  });
});

//显示消息提示
ipc.on("msg-box", (event, arg) => {
  dialog.showMessageBox({
    type: "info",
    title: "注意",
    message: arg
  });
});