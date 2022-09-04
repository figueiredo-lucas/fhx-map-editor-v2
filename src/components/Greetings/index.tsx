import { useState } from 'react';
import { MapRender } from '../MapRender';
import './styles.scss';

export function Greetings() {
  const [mapEntries, setMapEntries] = useState([]);
  const [mapName, setMapName] = useState('');

  window.Main.on('minimap-changed', (data: any) => {
    setMapEntries(data.entries);
    setMapName(data.mapName);
  });

  return (
    <div className="container">
      <MapRender entries={mapEntries} mapName={mapName} />
    </div>
  )
}

