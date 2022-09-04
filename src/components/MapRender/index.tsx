import React, { PropsWithChildren } from 'react'

const NAME_REGEX = /[A-Z_]+z(\d{1,3})x(\d{1,3})_Mini[mM]ap\.bmp/;
const TEST_MINIMAP = 'Test_MiniMap.bmp';

type MapEntry = {
  name: string,
  z: number,
  x: number
}

type MapMeta = {
  maxZ: number,
  maxX: number,
  mapEntries: MapEntry[]
}

const getEntriesMeta = (entries: string[]): MapMeta => {
  const mapMeta: MapMeta = {
    maxX: 0, maxZ: 0, mapEntries: []
  }

  mapMeta.mapEntries = entries.map<MapEntry>((e: string) => {
    const matches = NAME_REGEX.exec(e);
    if (!matches) return {} as MapEntry;
    const z = parseInt(matches[1]);
    const x = parseInt(matches[2]);
    mapMeta.maxZ = mapMeta.maxZ > z ? mapMeta.maxZ : z;
    mapMeta.maxX = mapMeta.maxX > x ? mapMeta.maxX : x;
    return {
      name: e,
      z,
      x
    }
  })
  return mapMeta;
}

const fillMissingIds = (mapMeta: MapMeta) => {
  if (!mapMeta.mapEntries.length) return;
  const baseArray = Array.from({ length: mapMeta.maxX + 1 }, (_, i) => i);

  Array(mapMeta.maxZ + 1).fill(0).forEach((_, rowIdx) => {
    const rowEntries = mapMeta.mapEntries.filter(e => e.z === rowIdx);
    const missingIds = baseArray.filter(b => !rowEntries.some(e => e.x === b));

    missingIds.forEach(x => {
      mapMeta.mapEntries.push({
        name: TEST_MINIMAP,
        z: rowIdx,
        x
      })
    })
  });

  mapMeta.mapEntries.sort((a, b) => {
    if (a.z > b.z) return -1;
    else if (a.z < b.z) return 1;
    else return a.x - b.x;
  });
}

export const MapRender = ({ entries, mapName, ...rest }: PropsWithChildren & { mapName: string, entries: string[] }) => {

  const mapMeta: MapMeta = getEntriesMeta(entries);
  fillMissingIds(mapMeta);
  const size = (window.screen.availHeight * 0.8) / (mapMeta.maxZ + 1) + 'px';
  const gridSize = mapMeta.maxX + 1;

  return (
    <div {...rest} style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, ${size} [col-start])` }}>
      {mapMeta.mapEntries.map((e, i) =>
        <img style={{ width: size }} key={i} src={`https://localhost:8443/minimap/${mapName}/${e.name}`} alt={e.name} />
      )}
    </div>
  )
}
