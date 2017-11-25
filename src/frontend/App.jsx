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
    this.toggleWrap = this.toggleWrap.bind(this)
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
        if (file.contents) {
          const lines = file.contents.split("\n")
          this.addLinesToFile(lines, file)
        }

        ipcRenderer.on(`line:${file.uuid}`, (sender, line) => this.addLineToFile(line, file))
      })
    })

    ipcRenderer.on('closedFile', (sender, file) => {
      this.removeFile(file, () => {
      })
    })
  }

  addFile (file, cb) {
    const files = JSON.parse(JSON.stringify(this.state.files))
    const currentFile = this.state.currentFile || file.uuid
    file.nowrap = true
    files.push(file)
    this.setState({ files, currentFile }, cb)
  }

  removeFile (file, cb) {
    const files = JSON.parse(JSON.stringify(this.state.files))
    const currentFile = this.state.currentFile || file.uuid
    const index = files.findIndex(f => f.uuid === file.uuid)
    files.splice(index, 1)
    this.setState({ files, currentFile }, cb)
  }

  addLineToFile (line, file) {
    const files = JSON.parse(JSON.stringify(this.state.files))
    const modifiedFile = files.filter(f => f.uuid === file.uuid)[0]
    if (modifiedFile) {
      if (!modifiedFile.lines || !modifiedFile.lines.length) {
        modifiedFile.lines = []
      }
      modifiedFile.lines.push(line)

      this.setState({ files })
    }
  }

  addLinesToFile (lines, file) {
    const files = JSON.parse(JSON.stringify(this.state.files))
    const modifiedFile = files.filter(f => f.uuid === file.uuid)[0]
    if (modifiedFile) {
      if (!modifiedFile.lines || !modifiedFile.lines.length) {
        modifiedFile.lines = []
      }

      lines.forEach(line => {
        modifiedFile.lines.push(line)
      })

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

  toggleWrap (id) {
    const files = this.state.files
    const file = files.filter(f => f.uuid === id)[0]
    if (file) {
      file.nowrap = !file.nowrap
      this.setState({ files })
    }
  }

  renderContent () {
    const file = this.currentFile()

    if (file.uuid) {
      return (
        <div className="content">
          <Log
            file={file}
            toggleWrap={this.toggleWrap}
          />
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
