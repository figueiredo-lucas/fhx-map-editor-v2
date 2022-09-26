import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import { BWH } from "../../electron/parsers/bwh/bwh";
import { useLayerContext } from "./Layers";
import { useZoomContext } from "./Zoom";

const MapContext = React.createContext<BWH | null>(null);

const MapProvider = ({ children }: PropsWithChildren) => {
  const [currentMap, setCurrentMap] = useState<BWH | null>(null);
  const layerCtx = useLayerContext();

  useEffect(() => {
    console.log('useEffect - Map - [layerCtx]');
    if (layerCtx?.layerInfo.showLoading) {
      setCurrentMap(null);
    }
  }, [layerCtx]);

  useEffect(() => {
    console.log('useEffect - Map - []');
    window.Main.on('map-selected', (data: BWH) => {
      setCurrentMap(() => data);
    });

    return () => {
      console.log('Destruct - useEffect - Map - []');
      window.Main.off('map-selected');
    }
  }, [])

  return <MapContext.Provider value={currentMap}>
    {children}
  </MapContext.Provider>
}

export default MapProvider;

export const useMapContext = () => useContext(MapContext);