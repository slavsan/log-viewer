import React from 'react'
import Sidebar from './components/Sidebar'
import Log from './components/Log'

const { ipcRenderer } = require('electron')

const utils = require('./lib/utils')
const parsers = require('./data')

const sortedParsers = parsers.sort(utils.compare)

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      currentFile: '',
      parsers: []
    }

    this.setListeners = this.setListeners.bind(this)
    this.toggleWrap = this.toggleWrap.bind(this)
    this.toggleExpand = this.toggleExpand.bind(this)
    this.setFormat = this.setFormat.bind(this)
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
    // console.log('add file:', file)
    const files = JSON.parse(JSON.stringify(this.state.files))
    const currentFile = this.state.currentFile || file.uuid
    file.nowrap = true
    file.raw = false // @todo default to true?
    files.push(file)
    this.setState({ files, currentFile }, cb)
  }

  addLineToFile (line, file) {
    // console.log('file (%s) has received new line: %s', file.filename, line)
    const files = JSON.parse(JSON.stringify(this.state.files))
    const modifiedFile = files.filter(f => f.uuid === file.uuid)[0]
    if (modifiedFile) {
      if (!modifiedFile.lines) {
        modifiedFile.lines = []
      }
      if (!modifiedFile.parsed) {
        modifiedFile.parsed = {
          lines: []
        }
      }
      modifiedFile.lines.push(line)
      utils.parseLine(sortedParsers, line, modifiedFile)

      this.setState({ files })
    }
  }

  currentFile () {
    const file = this.state.files.filter(f => f.uuid === this.state.currentFile)[0]
    if (!file) {
      return { filename: '', lines: [], parsed: { lines: [] } }
    }
    if (!file.lines) {
      file.lines = []
    }
    if (!file.parsed) {
      file.parsed = {
        lines: []
      }
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

  toggleExpand (fileId, lineId) {
    const files = this.state.files
    const file = files.filter(f => f.uuid === fileId)[0]
    if (file) {
      const line = file.parsed.lines.filter(l => l.uuid === lineId)[0]
      if (line) {
        line.expanded = !line.expanded
        this.setState({ files })
      }
    }
  }

  setFormat (id, format) {
    const files = this.state.files
    const file = files.filter(f => f.uuid === id)[0]
    if (file) {
      file.raw = (format === 'raw')
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
            onSetFormat={this.setFormat}
            toggleExpand={this.toggleExpand}
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
