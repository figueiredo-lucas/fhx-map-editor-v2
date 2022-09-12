export class BufferHelper {
  position = 0;

  reset() {
    this.position = 0;
  }

  subarray(buffer: Buffer, size: number): Buffer {
    const sub = buffer.subarray(this.position, this.position + size);
    this.position += size;
    return sub;
  }

  toString(buffer: Buffer, size: number, encoding: BufferEncoding) {
    const value = buffer.toString(encoding, this.position, this.position + size);
    this.position += size;
    return value;
  };

  readUInt8(buffer: Buffer): number {
    const value = buffer.readUInt8(this.position);
    this.position += 1;
    return value;
  }

  readInt8(buffer: Buffer): number {
    const value = buffer.readInt8(this.position);
    this.position += 1;
    return value;
  }

  readInt16LE(buffer: Buffer): number {
    const value = buffer.readInt16LE(this.position);
    this.position += 2;
    return value;
  }

  readInt32LE(buffer: Buffer): number {
    const value = buffer.readInt32LE(this.position);
    this.position += 4;
    return value;
  }

  readFloatLE(buffer: Buffer): number {
    const value = buffer.readFloatLE(this.position);
    this.position += 4;
    return value;
  }

  write(buffer: Buffer, value: string, size: number, encoding: BufferEncoding) {
    buffer.write(value, this.position, this.position + size, encoding);
    this.position += size;
  }

  writeUInt8(buffer: Buffer, value: number) {
    buffer.writeUInt8(value, this.position);
    this.position += 1;
  }

  writeInt8(buffer: Buffer, value: number) {
    buffer.writeInt8(value, this.position);
    this.position += 1;
  }

  writeInt16LE(buffer: Buffer, value: number) {
    buffer.writeInt16LE(value, this.position);
    this.position += 2;
  }

  writeInt32LE(buffer: Buffer, value: number) {
    buffer.writeInt32LE(value, this.position);
    this.position += 4;
  }

  writeFloatLE(buffer: Buffer, value: number) {
    buffer.writeFloatLE(value, this.position);
    this.position += 4;
  }
}