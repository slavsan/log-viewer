import React from 'react'
import classNames from 'classnames'

const Log = (props) => {
  const classes = classNames('line', {
    raw: true,
    nowrap: true
  })

  return (
    <div>
      {props.lines.map((line, index) =>
        <div key={index} className={classes}>{line}</div>
      )}
    </div>
  )
}

export default Log
