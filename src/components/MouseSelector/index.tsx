import React from 'react'
import { mouseModes, useMouseModeContext } from '../../providers/MouseMode'
import './styles.scss'

export const MouseSelector = () => {
  const { mouseMode, changeMouseMode } = useMouseModeContext();
  return (
    <div className="mouse-selector">
      {Object.keys(mouseModes).map(k => {
        const mm = mouseModes[k];
        return <button key={`mm-${k}`} className={mouseMode.className === mm.className ? 'active' : ''} onClick={() => changeMouseMode(k)}>
          {mm.cursorIcon ? <mm.cursorIcon /> : mm.altName}
        </button>
      })}
    </div>
  )
}
