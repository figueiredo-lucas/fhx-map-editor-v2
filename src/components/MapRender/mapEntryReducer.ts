export const initialState: MapMeta = {
  maxX: 0, maxZ: 0, mapEntries: []
};

const NAME_REGEX = /[A-Z_]+z(\d{1,3})x(\d{1,3})_Mini[mM]ap\.bmp/;
const TEST_MINIMAP = 'Test_MiniMap.bmp';

export const BUILD_MAP_META = 'build-map-meta';
export const TOGGLE_MAP_ENTRY = 'toggle-map-entry';
export const BUILD_MAP_ENTRY_DATA = 'build-map-entry-data';

const getEntriesMeta = (entries: string[]): MapMeta => {
  const mapMeta: MapMeta = {
    maxX: 0, maxZ: 0, mapEntries: []
  };

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
      x,
      active: false
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
        isEmpty: true,
        z: rowIdx,
        x,
        active: false
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
      if (!action.entries)`Trying to build MapMeta on entries that doesn't exist.`;
      const mapMeta = getEntriesMeta(action.entries || []);
      fillMissingIds(mapMeta);
      return mapMeta;
    }
    case TOGGLE_MAP_ENTRY: {
      if (!action.entryInfo) throw `Trying to toggle entry that doesn't exist.`;
      const entry = { ...action.entryInfo.entry };
      entry.active = !action.entryInfo.entry.active
      state.mapEntries.splice(action.entryInfo?.index, 1, entry);
      return { ...state };
    }
    case BUILD_MAP_ENTRY_DATA:
      if (!action.entryInfo || !action.entryInfo.entryData) throw `Trying to add entry data to an invalid entry`;
      const entry = { ...action.entryInfo.entry };
      entry.active = true;
      entry.entryData = action.entryInfo.entryData;
      state.mapEntries.splice(action.entryInfo?.index, 1, entry);
      return { ...state };
    default:
      throw new Error();
  }
}