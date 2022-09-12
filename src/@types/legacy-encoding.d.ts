declare module 'legacy-encoding' {
  function encode(input: string, encoding: string, options?: any): Buffer;
  function decode(buffer: Buffer, encoding: string, options?: any): string;
}