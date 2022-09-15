import React, { PropsWithChildren, useContext, useState } from "react";

type LayerInfo = {
  showGrid: boolean;
  showInvisibleBlocks: boolean;
  showLoading: boolean;
  heavenColor: HeavenEnum;
}

export enum LayerEnum {
  GRID = "showGrid",
  INVIS_BLOCKS = "showInvisibleBlocks",
  LOADING = "showLoading",
  HEAVEN_COLOR = "heavenColor"
};

export enum HeavenEnum {
  NONE = "",
  DAY_HEAVEN = "day_heaven",
  NIGHT_HEAVEN = "night_heaven",
  ORIGINAL_HEAVEN = "original_heaven",
  DAY_FOG = "day_fog",
  NIGHT_FOG = "night_fog"
}

interface ILayerContext {
  layerInfo: LayerInfo,
  toggleLayer: (type: LayerEnum, value?: boolean | HeavenEnum) => void
}

const LayerContext = React.createContext<ILayerContext | null>(null);

const LayerProvider = ({ children }: PropsWithChildren) => {
  const [layerInfo, setLayerInfo] = useState<LayerInfo>({ showLoading: false, showGrid: false, showInvisibleBlocks: false, heavenColor: HeavenEnum.NONE });

  const toggleLayer = (type: LayerEnum, value?: boolean | HeavenEnum) => {
    if (value === undefined) {
      setLayerInfo((curr) => ({ ...curr, [type]: !curr[type] }));
    } else {
      setLayerInfo((curr) => ({ ...curr, [type]: value }));
    }
  }

  return <LayerContext.Provider value={{ layerInfo, toggleLayer }}>
    {children}
  </LayerContext.Provider>
}

export default LayerProvider;

export const useLayerContext = () => useContext(LayerContext);