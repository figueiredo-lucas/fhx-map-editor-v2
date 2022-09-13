import { readdir, readFile, writeFile } from "fs-extra";
import { ZONES_DIR } from "../../shared/paths";
import { join } from "path";
import { BwhParser } from "../parsers/bwh";
import { BWH } from "../parsers/bwh/bwh";
import base from "./base";

const readZones = async () => {
  const zones = await readdir(ZONES_DIR);
  const directories: string[] = [];
  const bwhPaths: string[] = [];

  zones.forEach((z) => {
    const isXml = z.toLowerCase().endsWith('.xml');
    const isBwh = z.toLowerCase().endsWith('.bwh');
    const isDirectory = !isXml && !isBwh;
    if (isDirectory) {
      directories.push(join(ZONES_DIR, z));
    } else if (isBwh) {
      bwhPaths.push(z);
    }
  });

  return { directories, bwhPaths }
}

const readBwh = async (bwhPaths: string[]) => {
  const bwhParser = new BwhParser();
  bwhPaths.map(async filename => {
    const buff = await readFile(join(ZONES_DIR, filename));
    const bwh = bwhParser.parse(buff, filename, buff.byteLength);
    await writeJsonFromBwh(bwh);
  });
}

const writeJsonFromBwh = async (bwh: BWH) => {
  const filename = bwh.filename.toLowerCase().replace('.bwh', '.json');
  await writeFile(join(base.paths.CACHE, filename), JSON.stringify(bwh), { encoding: 'utf8' });
}

const loadBwhJson = async (bwhFilename: string) => {
  const filename = bwhFilename.toLowerCase().replace('.bwh', '.json');
  const bwhString = await readFile(join(base.paths.CACHE, filename), { encoding: 'utf8' });
  return JSON.parse(bwhString);
}

const readBfwd = async (directory: string) => {
  const dirPath = join(ZONES_DIR, directory);
  const files = await readdir(dirPath);
  const bfwdFiles = files.filter(f => f.toLowerCase().endsWith('.bfwd'));
  bfwdFiles
}