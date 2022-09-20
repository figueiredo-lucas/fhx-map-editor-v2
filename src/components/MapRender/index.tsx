import React, { useEffect, useReducer, useState } from 'react'
import SmoothScrollbar from "smooth-scrollbar";
import { useLayerContext } from '../../providers/Layers';
import { useMapContext } from '../../providers/Map';
import { Grid } from '../Grid';
import { InvisBlocks } from '../InvisibleBlocks';
import mapEntryReducer, { BUILD_MAP_META, CLEAR_MAP_META, initialState } from './mapEntryReducer';
import './styles.scss';

export const MapRender = () => {

  const [zoom, setZoom] = useState(100);
  const [mapMeta, dispatch] = useReducer(mapEntryReducer, initialState);
  const map = useMapContext();
  const layerCtx = useLayerContext();

  useEffect(() => {
    if (map) {
      dispatch({ type: BUILD_MAP_META, map });
    } else {
      dispatch({ type: CLEAR_MAP_META });
    }
  }, [map]);

  useEffect(() => {
    const scrollbar = SmoothScrollbar.getAll()[0];
    let timeout: NodeJS.Timeout | undefined = undefined;
    const ctrlScrollZoom = (event: WheelEvent) => {
      if (!event.altKey) return;

      event.preventDefault();
      if (timeout) clearTimeout(timeout);
      scrollbar.updatePluginOptions('disable-scroll', { disabled: true });
      timeout = setTimeout(() => {
        scrollbar.updatePluginOptions('disable-scroll', { disabled: false });
      }, 1000);

      setZoom((zoom) => {
        const { x, y } = scrollbar.offset;
        const tileSize = 128 * (zoom / 100);
        const deltaSize = 128 * 0.2; // delta will always be 20%
        const posX = x / 1.5 / tileSize; // empirically tested to be 1.5
        const posY = y / 1.5 / tileSize;
        const newZoom = event.deltaY < 0 ? zoom + 20 : zoom - 20;
        scrollbar.setPosition(x + deltaSize * posX, y + deltaSize * posY);

        if (event.deltaY < 0) {
          return zoom >= 580 ? zoom : newZoom;
        } else if (event.deltaY > 0) {
          return zoom <= 30 ? zoom : newZoom;
        }

        return zoom;
      });
    }

    window.addEventListener('wheel', ctrlScrollZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', ctrlScrollZoom);
    }
  }, []);

  const hasEntries = mapMeta.mapEntries.length > 0;

  const size = hasEntries ? 128 * (zoom / 100) : 0;
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
