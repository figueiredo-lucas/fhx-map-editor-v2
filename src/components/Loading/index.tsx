import React, { useEffect } from "react"
import GifLoading from "../../../assets/triangle_centered.gif";
import { LayerEnum, useLayerContext } from "../../providers/Layers";
import "./styles.scss";

export const Loading = () => {
  const layerCtx = useLayerContext();

  useEffect(() => {
    console.log('useEffect - Loading - []');
    window.Main.on('show-loading', () => {
      layerCtx?.toggleLayer(LayerEnum.LOADING, true);
    });

    return () => {
      console.log('Destruct - useEffect - Loading - []');
      window.Main.off('show-loading');
    }
  }, []);

  return (
    <>
      {layerCtx?.layerInfo.showLoading && <div className="loading">
        <img src={GifLoading} />
      </div>}
    </>
  )
}
