import React from 'react'
import { Button, ButtonGroup, Grid, Row, Col, Glyphicon } from 'react-bootstrap'
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
      <Grid fluid>
        <Row>
          <Col xs={2} sm={2} md={2} style={{ background: '#eee' }}>
            sidebar
          </Col>
          <Col xs={10} sm={10} md={10} className="content">
            <div className="toolbar">
              <h1>/path/to/file/here.log</h1>
              <div className="actions">
                <ButtonGroup bsSize="sm">
                  <Button>Wrap</Button>
                  <Button>Follow log</Button>
                </ButtonGroup>
                {' '}
                <ButtonGroup bsSize="sm">
                  <Button active>Raw</Button>
                  <Button>Parsed</Button>
                </ButtonGroup>
                {' '}
                <Button bsSize="sm" className="btn-settings">
                  <Glyphicon glyph="cog" title="Settings" />
                </Button>
              </div>
            </div>
            <div className="log">
              <Log lines={this.state.lines} />
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default App
