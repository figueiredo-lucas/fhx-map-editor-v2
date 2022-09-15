import React from 'react';
import './styles.scss';

type GridProps = {
  width: number;
  height: number;
  showBlockGrid?: boolean;
  style?: React.CSSProperties
};

export const Grid = ({ width, height, showBlockGrid, style }: GridProps) => {
  return (
    <div className="grid" style={style}>
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width={width / 128} height={height / 128} patternUnits="userSpaceOnUse">
            <path d={`M ${width / 128} 0 L 0 0 0 ${height / 128}`} fill="none" strokeWidth="0.5" />
          </pattern>
          <pattern id="mediumGrid" width={width / 8} height={height / 8} patternUnits="userSpaceOnUse">
            {width / 128 > 4 && <rect width={width} height={height} fill="url(#smallGrid)" />}
            <path d={`M ${width / 8} 0 L 0 0 0 ${height / 8}`} fill="none" strokeWidth="0.8" />
          </pattern>
          <pattern id="grid" width={width} height={height} patternUnits="userSpaceOnUse">
            {showBlockGrid && width / 8 > 20 && <rect width={width} height={height} fill="url(#mediumGrid)" />}
            <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}
