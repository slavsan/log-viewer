const path = require('path')
const { ipcMain } = require('electron')
const uuidv4 = require('uuid/V4')

const fileWatcher = require('./lib/fileWatcher')

const backend = module.exports = {}

let mainWindow

backend.openFiles = []

backend.init = (window) => {
  mainWindow = window
  backend.setFrontendListeners()
}

backend.openFile = (filename) => {
  if (backend.isFileAlreadyOpened(filename)) return
  backend.setFileWatcher(filename, (err, file) => {
    if (err) return console.error(err)
    backend.openFiles.push(file)
    mainWindow.webContents.send('openedFile', {
      uuid: file.uuid,
      filename: file.filename,
      shortName: file.shortName
    })
  })
}

backend.isFileAlreadyOpened = (filename) => {
  return Boolean(backend.openFiles.filter(f => f.filename === filename).length)
}

backend.setFrontendListeners = () => {
  ipcMain.on('openFiles', (event, filenames) => {
    // console.log('received filenames', filenames)
    if (!filenames || !filenames.length) return console.error('filenames are not specified')
    filenames.forEach(filename => backend.openFile(filename))
  })

  // @todo: maybe remove this, it's meant only for development
  // This makes sure that each time you hit `Cmd+R` and reload the frontend you will
  // still load the already opened files, without this you would need to restart the
  // entire app since the open files are stored in the backend
  ipcMain.on('loadFiles', () => {
    backend.openFiles.forEach(file => {
      mainWindow.webContents.send('openedFile', {
        uuid: file.uuid,
        filename: file.filename,
        shortName: file.shortName
      })
    })
  })
}

backend.getShortName = (filename) => {
  const parts = filename.split('/')
  return parts[parts.length - 1]
}

backend.setFileWatcher = (filename, cb) => {
  const uuid = uuidv4()

  const watcher = fileWatcher.watchFile(filename,
    (line) => {
      // console.log(`${uuid}: ${line}`)
      mainWindow.webContents.send(`line:${uuid}`, line)
    },
    (err) => {
      console.log('error is:', err)
    }
  )

  const file = {
    uuid: uuid,
    filename: filename,
    shortName: backend.getShortName(filename),
    watcher: watcher
  }

  return cb(null, file)
}
