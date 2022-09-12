import { FileMetadata } from "../FileParser";

export interface BFWD extends FileMetadata { // BladeEngine Field World Data
  header: string; // 5
  version: number;
  fieldTile: FieldTile;
  textures: TexturesV6 | TexturesV5; // depends on version
  fieldCells: Cell[]; // 128*128
  objects: Objects;
  effects: Effects;
  sounds: Sounds;
  waters: Waters;
}