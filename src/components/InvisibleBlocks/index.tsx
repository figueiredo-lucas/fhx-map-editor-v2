import React, { useEffect, useRef } from 'react'
import './styles.scss';

export const InvisBlocks = ({ size, mapMeta }: { size: number, mapMeta: MapMeta }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingSize = size / 128;
  // mapMeta.mapEntries

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const maxX = mapMeta.maxX;
    const maxY = mapMeta.maxZ;
    const xSize = size * (maxX + 1);
    const ySize = size * (maxY + 1);
    mapMeta.mapEntries.forEach((entry, idx) => {
      const row = Math.floor(idx / (mapMeta.maxX + 1));
      const col = idx % (mapMeta.maxX + 1);;

      if (entry.active && entry.entryData) {
        entry.entryData.fieldCells.forEach((c: any, i: number) => {
          if (c.cellType1 & (1 << 0)) {
            const cellRow = Math.floor(i / 128);
            const cellCol = 128 - i % 128;
            const y = ySize - ((maxY - col) * size + cellCol * drawingSize);
            const x = xSize - ((maxX - row) * size + cellRow * drawingSize);
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

      if (context) {
        draw(context)
      }
    }
  }, [draw])

  return (
    <canvas width={size * (mapMeta.maxX + 1)} height={size * (mapMeta.maxZ + 1)} ref={canvasRef} className="invisible-blocks-canvas" />
  )
}
