import React from 'react'
import { mouseModes, useMouseModeContext } from '../../providers/MouseMode'
import PointOnly from '../../../assets/logo-point.svg';
import './styles.scss'

export const MouseSelector = () => {
  const { mouseMode, changeMouseMode } = useMouseModeContext();
  return (
    <div className="mouse-selector">
      <button onClick={() => console.log('borabora')}>
        <PointOnly />
      </button>
      {Object.keys(mouseModes).map(k => {
        const mm = mouseModes[k];
        return <button key={`mm-${k}`} className={mouseMode.className === mm.className ? 'active' : ''} onClick={() => changeMouseMode(k)}>
          {mm.cursorIcon ? <mm.cursorIcon /> : mm.altName}
        </button>
      })}
    </div>
  )
}
