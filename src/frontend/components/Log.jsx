import React from 'react'
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import classNames from 'classnames'

const Log = ({ file }) => {
  const classes = classNames('line', {
    raw: true,
    nowrap: true
  })

  return (
    <div className="box">
      <div className="toolbar">
        <h1>{file.filename}</h1>
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
        <div>
          {file.lines.map((line, index) =>
            <div key={index} className={classes}>{line}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Log
