import React from 'react'
import Sidebar from './components/Sidebar'
import Log from './components/Log'

const { ipcRenderer } = require('electron')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      currentFile: ''
    }

    this.setListeners = this.setListeners.bind(this)
  }

  componentDidMount () {
    this.setListeners()
    this.loadFiles()
  }

  loadFiles () {
    ipcRenderer.send('loadFiles')
  }

  setListeners () {
    ipcRenderer.on('openedFile', (sender, file) => {
      this.addFile(file, () => {
        ipcRenderer.on(`line:${file.uuid}`, (sender, line) => this.addLineToFile(line, file))
      })
    })
  }

  addFile (file, cb) {
    console.log('add file:', file)
    const files = JSON.parse(JSON.stringify(this.state.files))
    const currentFile = this.state.currentFile || file.uuid
    files.push(file)
    this.setState({ files, currentFile }, cb)
  }

  addLineToFile (line, file) {
    console.log('file (%s) has received new line: %s', file.filename, line)
    const files = JSON.parse(JSON.stringify(this.state.files))
    const modifiedFile = files.filter(f => f.uuid === file.uuid)[0]
    if (modifiedFile) {
      if (!modifiedFile.lines) {
        modifiedFile.lines = []
      }
      modifiedFile.lines.push(line)
      this.setState({ files })
    }
  }

  currentFile () {
    const file = this.state.files.filter(f => f.uuid === this.state.currentFile)[0]
    if (!file) {
      return { filename: '', lines: [] }
    }
    if (!file.lines) {
      file.lines = []
    }
    return file
  }

  renderContent () {
    const file = this.currentFile()

    if (file.uuid) {
      return (
        <div className="content">
          <Log file={file} />
        </div>
      )
    }

    return (
      <div className="content empty">
        <div className="drag-n-drop">Drag and drop to load log files</div>
      </div>
    )
  }

  render () {
    return (
      <div className="app">
        <Sidebar
          files={this.state.files}
          currentFile={this.state.currentFile}
          onSelectFile={selected => this.setState({ currentFile: selected })}
        />
        {this.renderContent()}
      </div>
    )
  }
}

export default App
