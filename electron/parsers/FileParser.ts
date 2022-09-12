import { BufferHelper } from "./BufferHelper";

export interface FileMetadata {
  filename: string;
  size: number
}

export interface IFileParser<T extends FileMetadata> {
  parse: (data: Buffer, filename: string, size: number) => T;
  generate: (file: T) => Buffer;
}

export default class FileParser<T extends FileMetadata> implements IFileParser<T> {
  protected extension: string = '';
  protected bh: BufferHelper = new BufferHelper();

  parse(data: Buffer, filename: string, size: number) {
    this.bh.reset();
    return { filename, size } as T;
  };

  generate(file: T) {
    this.bh.reset();
    return Buffer.alloc(file.size);
  };

  readRGB(buffer: Buffer): RGB {
    return {
      r: this.bh.readUInt8(buffer),
      g: this.bh.readUInt8(buffer),
      b: this.bh.readUInt8(buffer),
    }
  }

  readFloatRGB(buffer: Buffer): RGB {
    return {
      r: this.bh.readFloatLE(buffer),
      g: this.bh.readFloatLE(buffer),
      b: this.bh.readFloatLE(buffer),
    }
  }

  writeRGB(buffer: Buffer, rgb: RGB) {
    this.bh.writeInt8(buffer, rgb.r);
    this.bh.writeInt8(buffer, rgb.g);
    this.bh.writeInt8(buffer, rgb.b);
  }

  writeFloatRGB(buffer: Buffer, rgb: RGB) {
    this.bh.writeFloatLE(buffer, rgb.r);
    this.bh.writeFloatLE(buffer, rgb.g);
    this.bh.writeFloatLE(buffer, rgb.b);
  }
}