import { BWH } from "../../../electron/parsers/bwh/bwh";

export type MapEntry = {
  name: string;
  isEmpty?: boolean;
  z: number;
  x: number;
  entryData?: number[];
}

export type MapMeta = {
  mapName: string;
  maxZ: number;
  maxX: number;
  mapEntries: MapEntry[];
}

export type MapEntryAction = {
  type: string;
  map?: BWH | null;
}