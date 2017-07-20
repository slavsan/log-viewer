import React from 'react'
import Log from './components/Log'

const { ipcRenderer } = require('electron')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lines: []
    }

    this.setListeners = this.setListeners.bind(this)
  }

  componentDidMount () {
    this.setListeners()
  }

  setListeners () {
    ipcRenderer.on('line', (sender, line) => {
      const lines = this.state.lines
      this.state.lines.push(line)
      this.setState({ lines })
    })
  }

  render () {
    return (
      <div>
        <h1>Log Viewer</h1>
        <Log lines={this.state.lines} />
      </div>
    )
  }
}

export default App
