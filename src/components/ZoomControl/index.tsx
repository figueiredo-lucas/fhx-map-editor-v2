import React from 'react'
import { useZoomContext } from '../../providers/Zoom'
import './styles.scss'
import { BsFullscreen, BsPlusSquare, BsDashSquare } from "react-icons/bs";
import { useMapContext } from '../../providers/Map';

export const ZoomControl = () => {
  const { zoom, zoomToFit, increaseZoom, decreaseZoom } = useZoomContext();
  const map = useMapContext();

  return (
    <div className="zoom-control">
      {map &&
        <>
          <BsPlusSquare onClick={increaseZoom} />
          <span className="zoom-control__text">{zoom}%</span>
          <BsDashSquare onClick={decreaseZoom} />
          <BsFullscreen onClick={zoomToFit} />
        </>}
    </div>
  )
}
