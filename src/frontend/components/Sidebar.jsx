import React from 'react'
import { Button } from 'react-bootstrap'
import { ipcRenderer, remote } from 'electron'
import classNames from 'classnames'

const dialog = remote.dialog

const openFiles = () => {
  dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, filenames => {
    ipcRenderer.send('openFiles', filenames)
  })
}

const classes = (file, currentFile) => {
  return classNames('', {
    active: file.uuid === currentFile
  })
}

const Sidebar = ({ files, onSelectFile, currentFile }) => {
  return (
    <div className="sidebar">
      <div>
        <h1>
          <span>Log</span>
          <span>Viewer</span>
        </h1>
        <ul>
          {files.map(file =>
            <li
              key={file.uuid}
              title={file.filename}
              className={classes(file, currentFile)}
              onClick={() => onSelectFile(file.uuid)}
            >
              {file.shortName}
            </li>
          )}
        </ul>
      </div>
      <div className="actions">
        <Button bsSize="sm" onClick={openFiles}>Add</Button>
      </div>
    </div>
  )
}

export default Sidebar
