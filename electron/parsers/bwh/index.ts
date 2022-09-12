import FileParser from "../FileParser";
import { BWH } from "./bwh";

export class BwhParser extends FileParser<BWH> {
  extension = '.bwh';

  parse(buffer: Buffer, filename: string, size: number): BWH {
    const file: BWH = super.parse(buffer, filename, size);
    file.header = this.bh.toString(buffer, 7, 'ascii');
    file.version = this.bh.readInt32LE(buffer);
    file.height = this.bh.readInt32LE(buffer);
    file.width = this.bh.readInt32LE(buffer);
    file.corner1 = this.bh.readFloatLE(buffer);
    file.zero1 = this.bh.readFloatLE(buffer);
    file.corner2 = this.bh.readFloatLE(buffer);
    file.corner3 = this.bh.readFloatLE(buffer);
    file.zero2 = this.bh.readFloatLE(buffer);
    file.corner4 = this.bh.readFloatLE(buffer);
    file.blocks = this.bh.readInt32LE(buffer);
    file.blockwidth = this.bh.readInt32LE(buffer);
    file.blockheight = this.bh.readInt32LE(buffer);
    file.unk1 = this.bh.readInt32LE(buffer);
    file.unk2 = this.bh.readInt32LE(buffer);
    this.readLod(buffer, file);
    file.unk3 = this.bh.readInt32LE(buffer);
    this.readZone(buffer, file);
    file.count_music = this.bh.readInt32LE(buffer);
    this.readOgg(buffer, file);
    console.log('Parsed successfully');
    return file;
  }

  generate(file: BWH): Buffer {
    const buff = super.generate(file);
    let position = 0;
    buff.write(file.header, position, 7, 'ascii');
    position += 7;
    buff.writeInt32LE(file.version, position);
    position += 4;
    buff.writeInt32LE(file.height, position);
    position += 4;
    buff.writeInt32LE(file.width, position);
    position += 4;
    buff.writeFloatLE(file.corner1, position);
    position += 4;
    buff.writeFloatLE(file.zero1, position);
    position += 4;
    buff.writeFloatLE(file.corner2, position);
    position += 4;
    buff.writeFloatLE(file.corner3, position);
    position += 4;
    buff.writeFloatLE(file.zero2, position);
    position += 4;
    buff.writeFloatLE(file.corner4, position);
    position += 4;
    buff.writeInt32LE(file.blocks, position);
    position += 4;
    buff.writeInt32LE(file.blockwidth, position);
    position += 4;
    buff.writeInt32LE(file.blockheight, position);
    position += 4;
    buff.writeInt32LE(file.unk1, position);
    position += 4;
    buff.writeInt32LE(file.unk2, position);
    position += 4;
    position = this.parseLodFromObject(file, buff, position);
    buff.writeInt32LE(file.unk3, position);
    position += 4;
    file.zone.forEach(zone => {
      position = this.parseZoneFromObject(zone, buff, position);
    });
    buff.writeInt32LE(file.count_music, position);
    position += 4;
    file.music.forEach(music => {
      position = this.parseOggFromObject(music, buff, position);
    });
    console.log('Generated successfully');
    return buff;
  }

  // LOD from buffer to Object
  private readLod(buffer: Buffer, file: BWH) {
    file.lod = [];
    for (let i = 0; i < 9; i++) {
      const stringSize = Math.pow(2, i + 3) - 4;
      file.lod[i] = {
        lod: this.bh.readInt32LE(buffer),
        blank: this.bh.toString(buffer, stringSize, 'hex')
      };
    }
  }

  // Zone from buffer to Object
  private readZone(buffer: Buffer, file: BWH) {
    file.zone = [];
    for (let i = 0; i < file.height * file.width; i++) {
      const zone: Field = {} as Field;

      zone.name = this.bh.toString(buffer, 20, 'ascii');
      zone.is_active = this.bh.readInt8(buffer);
      zone.unk = this.bh.toString(buffer, 3, 'hex');
      zone.day_fog = this.readFloatRGB(buffer);
      zone.day_fog_dist = {
        min: this.bh.readFloatLE(buffer),
        max: this.bh.readFloatLE(buffer)
      }
      zone.night_fog = this.readFloatRGB(buffer);
      zone.night_fog_dist = {
        min: this.bh.readFloatLE(buffer),
        max: this.bh.readFloatLE(buffer)
      }
      zone.original_heaven = this.readFloatRGB(buffer);
      zone.night_heaven = this.readFloatRGB(buffer);
      zone.day_heaven = this.readFloatRGB(buffer);
      file.zone.push(zone);
    }
  }

  // OGG from buffer to Object
  private readOgg(buffer: Buffer, file: BWH) {
    file.music = [];
    for (let i = 0; i < file.count_music; i++) {
      const ogg: Ogg = {} as Ogg;

      ogg.name_length = this.bh.readInt32LE(buffer);
      ogg.name = this.bh.toString(buffer, ogg.name_length, 'ascii');
      ogg.unk = this.bh.toString(buffer, 7, 'hex');
      ogg.path_length = this.bh.readInt32LE(buffer);
      ogg.path = this.bh.toString(buffer, ogg.path_length, 'ascii');
      file.music.push(ogg);
    }
  }

  private parseLodFromObject(file: BWH, buff: Buffer, position: number): number {
    file.lod.forEach((lod, idx) => {
      const stringSize = Math.pow(2, idx + 3) - 4;
      buff.writeInt32LE(lod.lod, position);
      position += 4;
      buff.write(lod.blank, position, position + stringSize, 'hex');
      position += stringSize;
    });
    return position;
  }

  private parseZoneFromObject(zone: Field, buff: Buffer, position: number): number {
    buff.write(zone.name.split('\0')[0], position, position + 20, 'ascii');
    position += 20;
    buff.writeInt8(zone.is_active, position);
    position += 1;
    buff.write(zone.unk, position, position + 3, 'hex');
    position += 3;
    position = this.parseRGBFromObject(zone.day_fog, buff, position);
    buff.writeFloatLE(zone.day_fog_dist.min, position);
    buff.writeFloatLE(zone.day_fog_dist.max, position + 4);
    position += 8;
    position = this.parseRGBFromObject(zone.night_fog, buff, position);
    buff.writeFloatLE(zone.night_fog_dist.min, position);
    buff.writeFloatLE(zone.night_fog_dist.max, position + 4);
    position += 8;
    position = this.parseRGBFromObject(zone.original_heaven, buff, position);
    position = this.parseRGBFromObject(zone.night_heaven, buff, position);
    position = this.parseRGBFromObject(zone.day_heaven, buff, position);
    return position;
  }

  private parseRGBFromObject(rgb: RGB, buff: Buffer, position: number): number {
    buff.writeFloatLE(rgb.r, position);
    position += 4;
    buff.writeFloatLE(rgb.g, position);
    position += 4;
    buff.writeFloatLE(rgb.b, position);
    position += 4;
    return position;
  }

  private parseOggFromObject(music: Ogg, buff: Buffer, position: number): number {
    buff.writeInt32LE(music.name_length, position);
    position += 4;
    buff.write(music.name, position, position + music.name_length, 'ascii');
    position += music.name_length;
    buff.write(music.unk, position, position + 7, 'hex');
    position += 7;
    buff.writeInt32LE(music.path_length, position);
    position += 4;
    buff.write(music.path, position, position + music.path_length, 'ascii');
    position += music.path_length;
    return position;
  }

}

export const bwhParser = new BwhParser();