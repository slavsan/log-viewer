import React from 'react'

const Log = (props) =>
  <div>
    {props.lines.map((line, index) =>
      <div key={index}>{line}</div>
    )}
  </div>

export default Log
