import { FileMetadata } from "../FileParser";

export interface BWH extends FileMetadata { // BladeEngine World Header
  filename: string,
  size: number,
  header: string,
  version: number,
  height: number,
  width: number,
  corner1: number,
  zero1: number,
  corner2: number,
  corner3: number,
  zero2: number,
  corner4: number,
  blocks: number,
  blockwidth: number,
  blockheight: number,
  unk1: number,
  unk2: number,
  lod: LOD[],
  unk3: number,
  zone: Field[],
  count_music: number,
  music: Ogg[],
  bfwdCells?: {
    [key: string]: number[] // from bfwd, will be saved as z0x0: [0,0,0,0...]
  },
  minimap?: string[]
}