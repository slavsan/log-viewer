import React from 'react'
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import classNames from 'classnames'

const Log = ({ file, toggleWrap }) => {
  const classes = classNames('log', {
    raw: true,
    nowrap: file.nowrap
  })

  return (
    <div className="box">
      <div className="toolbar">
        <h1>{file.filename}</h1>
        <div className="actions">
          <ButtonGroup bsSize="sm">
            <Button active={!file.nowrap} onClick={() => toggleWrap(file.uuid)}>Wrap</Button>
            <Button disabled>Follow log</Button>
          </ButtonGroup>
          {' '}
          <ButtonGroup bsSize="sm">
            <Button active>Raw</Button>
            <Button disabled>Parsed</Button>
          </ButtonGroup>
          {' '}
          <Button bsSize="sm" className="btn-settings">
            <Glyphicon glyph="cog" title="Settings" />
          </Button>
        </div>
      </div>
      <div className={classes}>
        <div>
          {file.lines.map((line, index) =>
            <div key={index} className="line">
              <span className="line-vertical-fix" />
              <span className="line-text">{line}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Log
