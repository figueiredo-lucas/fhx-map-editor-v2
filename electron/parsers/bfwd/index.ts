import FileParser from "../FileParser";
import legacy from 'legacy-encoding';
import { BFWD } from "./bfwd";

export class BfwdParser extends FileParser<BFWD> {
  extension = '.bfwd';

  parse(buffer: Buffer, filename: string, size: number): BFWD {
    const file: BFWD = super.parse(buffer, filename, size);
    file.header = this.bh.toString(buffer, 5, "ascii");
    file.version = this.bh.readInt32LE(buffer);
    this.readFieldTile(buffer, file);
    if (file.version === 6) this.readTexturesV6(buffer, file);
    this.readFieldCell(buffer, file);
    if (file.version === 5) this.readTexturesV5(buffer, file);
    this.readObjects(buffer, file);
    this.readEffects(buffer, file);
    this.readSounds(buffer, file);
    this.readWaters(buffer, file);
    console.log(`Parsed \x1b[35m${filename}\x1b[0m successfully`);
    return file;
  };

  generate(file: BFWD): Buffer {
    const buff = super.generate(file);
    return buff;
  };

  private readFieldTile(buffer: Buffer, file: BFWD) {
    file.fieldTile = { points: [] };
    const readValue = file.version === 5 ? this.bh.readInt16LE : this.bh.readFloatLE;
    for (let i = 0; i < 257 * 257; i++) {
      const point: Point = {
        height: readValue.bind(this.bh)(buffer),
        rgb: {
          r: this.bh.readUInt8(buffer),
          g: this.bh.readUInt8(buffer),
          b: this.bh.readUInt8(buffer),
        }
      }
      file.fieldTile.points.push(point);
    }
  }

  private readFieldCell(buffer: Buffer, file: BFWD) {
    file.fieldCells = [];
    for (let i = 0; i < 128 * 128; i++) {
      const c: Cell = {
        autoTexture: this.bh.readInt8(buffer),
        autoTextureIndex: this.bh.readInt8(buffer),
        textureOrientation: this.bh.readInt8(buffer),
        textureId: this.bh.readInt16LE(buffer),
        cellSound: this.bh.readInt8(buffer),
        cellType1: this.bh.readInt8(buffer),
        cellType2: this.bh.readInt8(buffer),
        grassSeed: this.bh.readInt16LE(buffer),
        grassId: this.bh.readInt8(buffer),
        grassCount: this.bh.readInt8(buffer),
        soundIndex: this.bh.readInt8(buffer)
      }
      file.fieldCells.push(c);
    }
  }

  private readTexturesV6(buffer: Buffer, file: BFWD) {
    file.textures = {} as TexturesV6;
    file.textures.blank1 = this.bh.readInt32LE(buffer);
    file.textures.defaultTextureLength = this.bh.readInt32LE(buffer);
    file.textures.defaultTexture = this.bh.toString(buffer, file.textures.defaultTextureLength, 'ascii');
    this.readTextures(buffer, file, 8);
  }

  private readTexturesV5(buffer: Buffer, file: BFWD) {
    file.textures = {} as TexturesV5;
    file.textures.texturesCount = this.bh.readInt32LE(buffer);
    this.readTextures(buffer, file, file.textures.texturesCount);
  }

  private readTextures(buffer: Buffer, file: BFWD, count: number) {
    file.textures.textures = [];
    for (let i = 0; i < count; i++) {
      const nameLength = this.bh.readInt32LE(buffer);
      const texture: Texture = {
        nameLength,
        name: this.bh.toString(buffer, nameLength, 'ascii')
      }

      if (file.version === 6) {
        texture.alphaLength = this.bh.readInt32LE(buffer);
        texture.hasAlpha = this.bh.toString(buffer, texture.alphaLength, 'ascii');
      }
    }
  }

  private readObjects(buffer: Buffer, file: BFWD) {
    file.objects = {
      objectsCount: this.bh.readInt32LE(buffer),
      gameObjects: []
    }
    for (let i = 0; i < file.objects.objectsCount; i++) {
      const o: CGameObject = {} as CGameObject;
      o.lengthNameEn = this.bh.readInt32LE(buffer);
      o.nameEn = this.bh.toString(buffer, o.lengthNameEn, 'ascii');
      o.lengthNameKr = this.bh.readInt32LE(buffer);
      const nameBuffer = this.bh.subarray(buffer, o.lengthNameKr);
      o.nameKr = legacy.decode(nameBuffer, 'cp949');
      o.worldMatrix = this.readBladeMatrix4(buffer);
      this.readObjectInfo(buffer, o);
      file.objects.gameObjects?.push(o);
    }
  }

  private readEffects(buffer: Buffer, file: BFWD) {
    file.effects = {
      effectsCount: this.bh.readInt32LE(buffer),
      effectObjects: []
    }
    for (let i = 0; i < file.effects.effectsCount; i++) {
      const effect: CEffectObject = {} as CEffectObject;
      effect.length1 = this.bh.readInt32LE(buffer);
      effect.name1 = this.bh.toString(buffer, effect.length1, 'ascii');
      effect.length2 = this.bh.readInt32LE(buffer);
      effect.name2 = this.bh.toString(buffer, effect.length2, 'ascii');
      effect.objectType = this.bh.readInt8(buffer);
      effect.LODdistance = this.bh.readInt32LE(buffer);
      effect.worldMatrix = this.readBladeMatrix4(buffer);
      file.effects.effectObjects?.push(effect);
    }
  }

  private readSounds(buffer: Buffer, file: BFWD) {
    file.sounds = {
      soundsCount: this.bh.readInt32LE(buffer),
      soundObjects: []
    }
    for (let i = 0; i < file.sounds.soundsCount; i++) {
      const sound: CSoundObject = {} as CSoundObject;
      sound.length1 = this.bh.readInt32LE(buffer);
      sound.name1 = this.bh.toString(buffer, sound.length1, 'ascii');
      sound.length2 = this.bh.readInt32LE(buffer);
      sound.name2 = this.bh.toString(buffer, sound.length2, 'ascii');
      sound.LODdistance = this.bh.readInt32LE(buffer);
      sound.position = this.readBladeVector3(buffer)
      file.sounds.soundObjects?.push(sound);
    }
  }

  private readWaters(buffer: Buffer, file: BFWD) {
    file.waters = {
      watersCount: this.bh.readInt32LE(buffer),
      bladeCWaters: []
    }
    for (let i = 0; i < file.waters.watersCount; i++) {
      file.waters.bladeCWaters?.push(this.readBladeWater(buffer));
    }
  }

  private readObjectInfo(buffer: Buffer, gameObject: CGameObject) {
    gameObject.objectInfo = {} as ObjectInfo;
    gameObject.objectInfo.objectType = this.bh.readInt8(buffer);
    this.bh.toString(buffer, 3, 'hex');
    gameObject.objectInfo.scale = this.bh.readFloatLE(buffer);
    gameObject.objectInfo.hasCollision = this.bh.readInt32LE(buffer);
    gameObject.objectInfo.portalType = this.bh.readInt8(buffer);
    this.bh.toString(buffer, 1, 'hex');
    gameObject.objectInfo.portalIdx = this.bh.readInt16LE(buffer);
    gameObject.objectInfo.LODdistance = this.bh.readInt32LE(buffer);
  }

  private readBladeMatrix4(buffer: Buffer): BladeCMatrix4 {
    return {
      _0: Array(4).fill(0).map(_ => this.bh.readFloatLE(buffer)),
      _1: Array(4).fill(0).map(_ => this.bh.readFloatLE(buffer)),
      _2: Array(4).fill(0).map(_ => this.bh.readFloatLE(buffer)),
      _3: Array(4).fill(0).map(_ => this.bh.readFloatLE(buffer)),
    }
  }

  private readBladeVector3(buffer: Buffer): BladeCVector3 {
    return {
      x: this.bh.readFloatLE(buffer),
      y: this.bh.readFloatLE(buffer),
      z: this.bh.readFloatLE(buffer),
    }
  }

  readBladeWater(buffer: Buffer): BladeCWater {
    const water: BladeCWater = {} as BladeCWater;
    water.upTextureLength = this.bh.readInt32LE(buffer);
    water.upTexture = this.bh.toString(buffer, water.upTextureLength, 'ascii');
    water.downTextureLength = this.bh.readInt32LE(buffer);
    water.downTexture = this.bh.toString(buffer, water.downTextureLength, 'ascii');
    water.waterInfo = this.readWaterInfo(buffer);
    water.reflectionInfo = this.readReflectionInfo(buffer);
    return water;
  }

  readWaterInfo(buffer: Buffer): WaterInfo {
    const waterInfo: WaterInfo = {} as WaterInfo;
    waterInfo.cellsX = this.bh.readInt32LE(buffer);
    waterInfo.cellsY = this.bh.readInt32LE(buffer);
    waterInfo.cellSize = this.bh.readInt32LE(buffer);
    waterInfo.cellHeight = this.bh.readInt32LE(buffer);
    waterInfo.cellWidth = this.bh.readInt32LE(buffer);
    waterInfo.UTileSize = this.bh.readInt32LE(buffer);
    waterInfo.VTileSize = this.bh.readInt32LE(buffer);
    waterInfo.useUVAni = this.bh.readInt8(buffer);
    this.bh.toString(buffer, 3, 'hex');
    waterInfo.U1Speed = this.bh.readFloatLE(buffer);
    waterInfo.V1Speed = this.bh.readFloatLE(buffer);
    waterInfo.U2Speed = this.bh.readFloatLE(buffer);
    waterInfo.V2Speed = this.bh.readFloatLE(buffer);

    waterInfo.unknown1 = this.bh.readInt8(buffer);
    this.bh.toString(buffer, 3, 'hex');
    waterInfo.unknown2 = this.bh.readFloatLE(buffer);
    waterInfo.unknown3 = this.bh.readFloatLE(buffer);
    this.bh.toString(buffer, 4, 'hex');

    waterInfo.useAlpha = this.bh.readInt8(buffer);
    waterInfo.alphaValue = this.bh.readUInt8(buffer);
    this.bh.toString(buffer, 2, 'hex');
    waterInfo.alphaSrcBlend = this.bh.readInt32LE(buffer);
    waterInfo.alphaDestBlend = this.bh.readInt32LE(buffer);

    waterInfo.position1 = this.readBladeVector3(buffer);
    waterInfo.position2 = this.readBladeVector3(buffer);

    return waterInfo;
  }

  readReflectionInfo(buffer: Buffer): ReflectionInfo {
    const reflectionInfo: ReflectionInfo = {} as ReflectionInfo;
    reflectionInfo.useReflection = this.bh.readInt8(buffer);
    this.bh.toString(buffer, 3, 'hex');
    reflectionInfo.color = {
      r: this.bh.readUInt8(buffer),
      g: this.bh.readUInt8(buffer),
      b: this.bh.readUInt8(buffer),
      a: this.bh.readUInt8(buffer),
    };
    reflectionInfo.speed1 = this.bh.readFloatLE(buffer);
    reflectionInfo.speed2 = this.bh.readFloatLE(buffer);
    return reflectionInfo;
  }
}