import React, { useEffect, useRef } from 'react'
import { LayerEnum, useLayerContext } from '../../providers/Layers';
import { MapMeta } from '../MapRender/types';
import './styles.scss';

export const InvisBlocks = ({ size, mapMeta, style }: { size: number, mapMeta: MapMeta, style: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerCtx = useLayerContext();
  const drawingSize = size / 128;

  const draw = (ctx: CanvasRenderingContext2D) => {
    console.log('drawing now');
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const maxX = mapMeta.maxX;
    const maxY = mapMeta.maxZ;
    const xSize = size * maxX;
    const ySize = size * maxY;
    mapMeta.mapEntries.forEach((entry, idx) => {
      const row = Math.floor(idx / (mapMeta.maxX));
      const col = idx % (mapMeta.maxX);

      if (entry.entryData) {
        entry.entryData.forEach((d: any, i: number) => {
          if (d & (1 << 0)) {
            const cellRow = Math.floor(i / 128);
            const cellCol = 128 - i % 128;
            const y = ySize - ((maxY - 1 - col) * size + cellCol * drawingSize);
            const x = xSize - ((maxX - 1 - row) * size + cellRow * drawingSize);
            ctx.fillRect(y, x, drawingSize, drawingSize);
          }
        })
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d');

      if (context && mapMeta.mapEntries.length > 0) {
        draw(context);
        layerCtx?.toggleLayer(LayerEnum.LOADING, false);
      }
    }
  }, [mapMeta, size])

  return (
    <>
      <canvas style={style} width={size * (mapMeta.maxX)} height={size * (mapMeta.maxZ)} ref={canvasRef} className="invisible-blocks__canvas" />
    </>
  )
}
