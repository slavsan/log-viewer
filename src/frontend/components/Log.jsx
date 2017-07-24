import React from 'react'
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import classNames from 'classnames'

const getTitle = (line) => {
  if (!line.lines) return line.text
  return line.lines.join('|')
}

const Log = ({ file, toggleWrap, onSetFormat, toggleExpand }) => {
  const classes = classNames('log', {
    raw: file.raw,
    nowrap: file.nowrap
  })

  const lines = file.raw ? (
    <div style={{ width: '100%' }}>
      {file.lines.map((line, index) =>
        <div key={index} className="line">
          <div className="line-vertical-fix" />
          <div className="line-text">{line}</div>
        </div>
      )}
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      {file.parsed.lines.map(line =>
        <div
          key={line.uuid}
          className="line"
          title={getTitle(line)}
          onClick={() => toggleExpand(file.uuid, line.uuid)}
        >
          <div className="line-vertical-fix" style={{ background: line.color }} />
          <div className="line-text">
            {line.text}
            {line.expanded && line.lines && (
              <div>
                {line.lines.map((l, index) =>
                  <div key={index}>{l}</div>
                )}
              </div>
            )}
          </div>
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
