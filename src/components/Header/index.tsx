import React from 'react'
import { useMapContext } from '../../providers/Map'
import { MouseSelector } from '../MouseSelector'
import './styles.scss'

export const Header = () => {
  const map = useMapContext();
  return (
    <div className="header">
      <MouseSelector /><span className="map-title">{map?.filename}</span>
    </div>
  )
}
