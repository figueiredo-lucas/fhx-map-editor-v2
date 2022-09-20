import React, { useEffect, useReducer } from 'react'
import { useLayerContext } from '../../providers/Layers';
import { useMapContext } from '../../providers/Map';
import { useZoomContext } from '../../providers/Zoom';
import { Grid } from '../Grid';
import { InvisBlocks } from '../InvisibleBlocks';
import mapEntryReducer, { BUILD_MAP_META, CLEAR_MAP_META, initialState } from './mapEntryReducer';
import './styles.scss';

export const MapRender = () => {

  const [mapMeta, dispatch] = useReducer(mapEntryReducer, initialState);
  const map = useMapContext();
  const layerCtx = useLayerContext();
  const [zoom] = useZoomContext();

  useEffect(() => {
    if (map) {
      dispatch({ type: BUILD_MAP_META, map });
    } else {
      dispatch({ type: CLEAR_MAP_META });
    }
  }, [map]);

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
