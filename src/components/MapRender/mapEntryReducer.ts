import { BWH } from "../../../electron/parsers/bwh/bwh";
import { MapEntry, MapEntryAction, MapMeta } from "./types";

export const initialState: MapMeta = {
  mapName: '', maxX: 0, maxZ: 0, mapEntries: []
};

const NAME_REGEX = /[A-Z_]+z(\d{1,3})x(\d{1,3})_Mini[mM]ap\.bmp/;
const TEST_MINIMAP = 'Test_MiniMap.bmp';

export const BUILD_MAP_META = 'build-map-meta';
export const CLEAR_MAP_META = 'clear-map-meta';

const getEntriesMeta = (map: BWH): MapMeta => {
  const mapMeta: MapMeta = {
    mapName: map.filename.replace(/\.bwh/i, ''), maxX: map.width, maxZ: map.height, mapEntries: []
  };
  const entries = map.minimap || [];

  mapMeta.mapEntries = entries.map<MapEntry>((e: string) => {
    const entryName = e.replace(/_Minimap\.bmp/i, '');
    const matches = NAME_REGEX.exec(e);
    if (!matches) return {} as MapEntry;
    const z = parseInt(matches[1]);
    const x = parseInt(matches[2]);

    return {
      name: e,
      z,
      x,
      entryData: map.bfwdCells ? map.bfwdCells[entryName] : undefined
    }
  })
  return mapMeta;
}

const fillMissingIds = (mapMeta: MapMeta) => {
  if (!mapMeta.mapEntries.length) return;
  const baseArray = Array.from({ length: mapMeta.maxX }, (_, i) => i);

  Array(mapMeta.maxZ).fill(0).forEach((_, rowIdx) => {
    const rowEntries = mapMeta.mapEntries.filter(e => e.z === rowIdx);
    const missingIds = baseArray.filter(b => !rowEntries.some(e => e.x === b));

    missingIds.forEach(x => {
      mapMeta.mapEntries.push({
        name: TEST_MINIMAP,
        isEmpty: true,
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

export default (state: MapMeta, action: MapEntryAction) => {
  switch (action.type) {
    case BUILD_MAP_META: {
      if (!action.map) throw `Trying to build MapMeta on entries that doesn't exist.`;
      const mapMeta = getEntriesMeta(action.map);
      fillMissingIds(mapMeta);
      return mapMeta;
    }
    case CLEAR_MAP_META: {
      return { ...initialState };
    }
    default:
      throw new Error();
  }
}