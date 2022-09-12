type MapEntry = {
  name: string,
  isEmpty?: boolean;
  z: number,
  x: number,
  active: boolean,
  entryData?: any
}

type MapMeta = {
  maxZ: number,
  maxX: number,
  mapEntries: MapEntry[]
}

type MapEntryAction = {
  type: string;
  entries?: string[];
  entryInfo?: {
    index: number;
    entry: MapEntry;
    entryData?: any
  };
}