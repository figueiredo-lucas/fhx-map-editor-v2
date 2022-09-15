import React, { useEffect, useReducer, useState } from 'react'
import { useLayerContext } from '../../providers/Layers';
import { useMapContext } from '../../providers/Map';
import { Grid } from '../Grid';
import { InvisBlocks } from '../InvisibleBlocks';
import mapEntryReducer, { BUILD_MAP_META, CLEAR_MAP_META, initialState } from './mapEntryReducer';
import './styles.scss';

export const MapRender = () => {

  const [zoom, setZoom] = useState(100);
  const [zoomLock, setZoomLock] = useState(false);
  const [mapMeta, dispatch] = useReducer(mapEntryReducer, initialState);
  const map = useMapContext();
  const layerCtx = useLayerContext();

  useEffect(() => {
    if (map) {
      dispatch({ type: BUILD_MAP_META, map });
    } else {
      dispatch({ type: CLEAR_MAP_META });
    }
    setZoomLock(false);
  }, [map]);

  useEffect(() => {
    const ctrlScrollZoom = (event: WheelEvent) => {
      if (!event.altKey) return;
      event.preventDefault();

      let growth = zoom > 1000 ? 100 : 50;
      if (event.deltaY < 0) {
        if (!zoomLock) {
          setZoom((zoom) => zoom >= 2000 ? zoom : zoom + growth);
        }
      } else if (event.deltaY > 0) {
        setZoom((zoom) => zoom < 100 ? zoom : zoom - growth);
        setZoomLock(false);
      }
    }

    window.addEventListener('wheel', ctrlScrollZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', ctrlScrollZoom);
    }
  }, [zoomLock]);

  const hasEntries = mapMeta.mapEntries.length > 0;

  const size = hasEntries ? (window.screen.availHeight * 0.8) / (mapMeta.maxZ) * (zoom / 100) : 0;
  if (size > (window.screen.availHeight * 0.7) && !zoomLock) {
    setZoomLock(true);
  }
  const gridSize = hasEntries ? mapMeta.maxX : 0;

  return (
    <div className="map-render">
      <Grid width={size} height={size} showBlockGrid style={layerCtx?.layerInfo.showGrid ? {} : { display: 'none' }} />
      <InvisBlocks size={size} mapMeta={mapMeta} style={layerCtx?.layerInfo.showInvisibleBlocks ? {} : { display: 'none' }} />
      <div className="image-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, ${size + 'px'} [col-start])` }}>
        {mapMeta.mapEntries.map((e, i) =>
          <img style={{ width: size }} key={i} src={`http://localhost:8000/minimap/${mapMeta.mapName}/${e.name}`} alt={e.name} />
        )}
      </div>
    </div>
  )
}
