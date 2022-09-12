import React, { useEffect, useReducer, useState } from 'react'
import { map } from '../../../webpack/rules.webpack';
import { Grid } from '../Grid';
import { InvisBlocks } from '../InvisibleBlocks';
import mapEntryReducer, { BUILD_MAP_ENTRY_DATA, BUILD_MAP_META, initialState, TOGGLE_MAP_ENTRY } from './mapEntryReducer';
import './styles.scss';

export const MapRender = ({ entries, mapName }: { mapName: string, entries: string[] }) => {

  const [zoom, setZoom] = useState(100);
  const [zoomLock, setZoomLock] = useState(false);
  const [mapMeta, dispatch] = useReducer(mapEntryReducer, initialState);

  useEffect(() => {
    dispatch({ type: BUILD_MAP_META, entries });
    setZoomLock(false);
  }, [entries]);

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

  const loadBlockData = (entry: MapEntry, index: number) => {
    if (!entry.isEmpty) {
      if (!entry.entryData) {
        const entryData = window.Main.sendSyncMessage('get-bwfd', { mapName, bfwdName: entry.name.replace(/_minimap\.bmp/i, '') });
        dispatch({ type: BUILD_MAP_ENTRY_DATA, entryInfo: { index, entry, entryData } });
      } else {
        dispatch({ type: TOGGLE_MAP_ENTRY, entryInfo: { index, entry } });
      }
    }
  }

  const hasEntries = mapMeta.mapEntries.length > 0;

  const size = hasEntries ? (window.screen.availHeight * 0.8) / (mapMeta.maxZ + 1) * (zoom / 100) : 0;
  if (size > (window.screen.availHeight * 0.7) && !zoomLock) {
    setZoomLock(true);
  }
  const gridSize = hasEntries ? mapMeta.maxX + 1 : 0;

  return (
    <div className="map-render">
      <Grid width={size} height={size} showBlockGrid />
      <InvisBlocks size={size} mapMeta={mapMeta} />
      <div className="image-grid" style={{ gridTemplateColumns: `repeat(${gridSize}, ${size + 'px'} [col-start])` }}>
        {mapMeta.mapEntries.map((e, i) =>
          <img className={e.active ? 'active' : ''} onClick={() => loadBlockData(e, i)} style={{ width: size }} key={i} src={`http://localhost:8000/minimap/${mapName}/${e.name}`} alt={e.name} />
        )}
      </div>
    </div>
  )
}
