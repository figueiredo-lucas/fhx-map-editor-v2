import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { BWH } from "../../electron/parsers/bwh/bwh";


const MapContext = React.createContext<BWH | null>(null);

const MapProvider = ({ children }: PropsWithChildren) => {
  const [currentMap, setCurrentMap] = useState<BWH | null>(null);

  useEffect(() => {
    window.Main.on('map-selected', (data: BWH) => {
      setCurrentMap(() => data);
    });

    return () => {
      window.Main.off('map-selected');
    }
  }, [])

  return <MapContext.Provider value={currentMap}>
    {children}
  </MapContext.Provider>
}

export default MapProvider;

export const useMapContext = () => useContext(MapContext);