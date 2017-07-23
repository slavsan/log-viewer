import React from 'react'
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import classNames from 'classnames'

const getTitle = (line) => {
  if (!line.lines) return line.text
  return line.lines.join('|')
}

const Log = ({ file, toggleWrap, onSetFormat }) => {
  const classes = classNames('log', {
    raw: file.raw,
    nowrap: file.nowrap
  })

  const lines = file.raw ? (
    <div style={{ width: '100%' }}>
      {file.lines.map((line, index) =>
        <div key={index} className="line">
          <span className="line-vertical-fix" />
          <span className="line-text">{line}</span>
        </div>
      )}
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      {file.parsed.lines.map((line, index) =>
        <div key={index} className="line" title={getTitle(line)}>
          <span className="line-vertical-fix" style={{ background: line.color }} />
          <span className="line-text">{line.text}</span>
        </div>
      )}
    </div>
  )

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
            <Button active={file.raw} onClick={() => onSetFormat(file.uuid, 'raw')}>Raw</Button>
            <Button active={!file.raw} onClick={() => onSetFormat(file.uuid, 'parsed')}>Parsed</Button>
          </ButtonGroup>
          {' '}
          <Button bsSize="sm" className="btn-settings">
            <Glyphicon glyph="cog" title="Settings" />
          </Button>
        </div>
      </div>
      <div className={classes}>
        {lines}
      </div>
    </div>
  )
}

export default Log
