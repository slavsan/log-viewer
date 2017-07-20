const path = require('path')
// const { ipcMain } = require('electron')
const fileWatcher = require('./lib/fileWatcher')

const backend = module.exports = {}

let mainWindow

backend.init = (window) => {
  mainWindow = window
  backend._setFrontendListeners()
  backend._setFileWatcher()
}

backend._setFrontendListeners = () => {
  // ipcMain.on('foo', (event, arg) => {
  //   setTimeout(() => {
  //     event.sender.send(`bar:${arg.cbId}`, { foo: 'bar' })
  //   }, 2500)
  // })
}

backend._setFileWatcher = () => {
  const cwd = process.cwd()
  const logFile = path.join(cwd, 'test.log')

  fileWatcher.watchFile(logFile,
    (line) => {
      console.log('new line is:', line)
      mainWindow.webContents.send('line', line)
    },
    (err) => {
      console.log('error is:', err)
    }
  )
}
