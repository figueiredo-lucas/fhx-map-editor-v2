enum ObjectType {
  StaticObject = 0,
  DynamicObject = 1,
  CompositionObject = 2,
  CompleteObject = 3,
  WearItemObject = 4
}

enum Collision {
  False = 1,
  True = 2
}

enum PortalType {
  NoPortal = 0,
  Intramap = 1,
  Intermap = 2
}

enum CellType {
  PreventsMovement = 1 << 0,
  DisplayDivide = 1 << 2,
  Unknown = 1 << 3,
  ModifiesHeight = 1 << 4,
  InsertAfterInfo = 1 << 5
}

type BladeCMatrix4 = {
  _0: number[]; // 4
  _1: number[]; // 4
  _2: number[]; // 4
  _3: number[]; // 4
};

type BladeCVector3 = {
  x: number;
  y: number;
  z: number;
};

type CSoundObject = {
  length1: number;
  name1: string; // should have length stated by length1
  length2: number;
  name2: string; // should have length stated by length2
  LODdistance: number;
  position: BladeCVector3;
};

type Sounds = {
  soundsCount: number;
  soundObjects?: CSoundObject[] // soundsCount
};

type WaterInfo = {
  cellsX: number;
  cellsY: number;
  cellSize: number;
  cellHeight: number;
  cellWidth: number;
  UTileSize: number;
  VTileSize: number;

  useUVAni: number;
  // byte padding1[3] < hidden=true >;
  U1Speed: number;
  V1Speed: number;
  U2Speed: number;
  V2Speed: number;

  unknown1: number;
  // byte padding2[3] < hidden=true >;
  unknown2: number;
  unknown3: number;
  // byte padding3[4] < hidden=true >;

  useAlpha: number;
  alphaValue: number;
  // byte padding4[2] < hidden=true >;
  alphaSrcBlend: number;
  alphaDestBlend: number;

  position1: BladeCVector3;
  position2: BladeCVector3;
};

type ReflectionInfo = {
  useReflection: number;
  color: RGBA;
  speed1: number;
  speed2: number;
};

type BladeCWater = {
  upTextureLength: number;
  upTexture: string; // should have length stated by upTexturelength
  downTextureLength: number;
  downTexture: string;  // should have length stated by downTextureLength
  waterInfo: WaterInfo;
  reflectionInfo: ReflectionInfo;
};

type Waters = {
  watersCount: number;
  bladeCWaters?: BladeCWater[]; // watersCount
};

type CEffectObject = {
  length1: number;
  name1: string; // should have length stated by length1
  length2: number;
  name2: string; // should have length stated by length2
  objectType: ObjectType;
  LODdistance: number;
  worldMatrix: BladeCMatrix4;
};

type Effects = {
  effectsCount: number;
  effectObjects?: CEffectObject[] // effectsCount
};

type ObjectInfo = {
  objectType: ObjectType;
  // byte padding1[3] < hidden=true >;
  scale: number;
  hasCollision: Collision; //collision: 1 - no collision 2 - collision
  portalType: PortalType; //portals: 1 - intramap 2- intermap
  // byte padding2 < hidden=true >;
  portalIdx: number; // refers to vector position in field.tbl and gate.tbl
  LODdistance: number;
};

type CGameObject = {
  lengthNameEn: number;
  nameEn: string; // should have length stated by length1
  lengthNameKr: number;
  nameKr: string; // should have length stated by length2
  worldMatrix: BladeCMatrix4;
  objectInfo: ObjectInfo;
};

type Objects = {
  objectsCount: number;
  gameObjects?: CGameObject[] // objectsCount
};

type Cell = {
  autoTexture: number;
  autoTextureIndex: number;
  textureOrientation: number;
  textureId: number;
  cellSound: number;
  cellType1: CellType;
  cellType2: CellType;
  grassSeed: number;
  grassId: number;
  grassCount: number;
  soundIndex: number;
};

type Texture = {
  nameLength: number;
  name: string; // should have length stated by nameLength
  alphaLength?: number; // only existing in TextureSv6
  hasAlpha?: string; // only existing in TextureSv6; should have length stated by alphaLength
};

type TexturesV6 = {
  blank1: number; //spacer? unused?
  defaultTextureLength: number
  defaultTexture: string; // should have length stated by defaultTextureLength
  textures: Texture[]; // 8
};

type TexturesV5 = {
  texturesCount: number;
  textures?: Texture[]; // texturesCount
};

type Point = {
  height: number;
  rgb: RGB;
};

type FieldTile = {
  points: Point[]; // 257*257
};
