import React from "react"
import { LayerEnum, useLayerContext } from "../../providers/Layers";
import "./styles.scss";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

export const Sidebar = () => {

  const layerCtx = useLayerContext();

  const renderIcon = (show: boolean) => show ? <BsEyeFill /> : <BsEyeSlashFill />

  return (
    <div className="sidebar">
      <ul className="map-options-list">
        <li onClick={() => layerCtx?.toggleLayer(LayerEnum.GRID)}>
          <span className="label">Grid</span>
          <span className="toggle-icon">{renderIcon(!!layerCtx?.layerInfo.showGrid)}</span>
        </li>
        <li onClick={() => layerCtx?.toggleLayer(LayerEnum.INVIS_BLOCKS)}>
          <span className="label">Invisible Blocks</span>
          <span className="toggle-icon">{renderIcon(!!layerCtx?.layerInfo.showInvisibleBlocks)}</span>
        </li>
      </ul>
    </div>
  )
}
