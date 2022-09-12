import { useState } from 'react';
import { useMouseModeContext } from '../../providers/MouseMode';
import { MapRender } from '../MapRender';
import './styles.scss';


export function Container() {
  const [mapEntries, setMapEntries] = useState([]);
  const [mapName, setMapName] = useState('');

  const { mouseMode } = useMouseModeContext();

  window.Main.on('minimap-changed', (data: any) => {
    setMapEntries(data.entries);
    setMapName(data.mapName);
  });

  return (
    <div className={`container ${mouseMode.className}`}>
      <MapRender entries={mapEntries} mapName={mapName} />
    </div>
  )
}

