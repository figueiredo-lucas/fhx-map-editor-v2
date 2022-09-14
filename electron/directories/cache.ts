import { ensureDir, ensureDirSync, readdir, readdirSync, readFile, readFileSync, writeFile, writeFileSync } from "fs-extra";
import { ZONES_DIR } from "../../shared/paths";
import { join } from "path";
import { BwhParser } from "../parsers/bwh";
import { BWH } from "../parsers/bwh/bwh";
import base from "./base";
import { BfwdParser } from "../parsers/bfwd";
import { BFWD } from "../parsers/bfwd/bfwd";
import { stringLiteral } from "@babel/types";

const readZones = () => {
  const zones = readdirSync(ZONES_DIR);
  const directories: string[] = [];
  const bwhPaths: string[] = [];

  zones.forEach((z) => {
    const isXml = z.toLowerCase().endsWith('.xml');
    const isBwh = z.toLowerCase().endsWith('.bwh');
    const isDirectory = !isXml && !isBwh;
    if (isDirectory) {
      directories.push(z);
    } else if (isBwh) {
      bwhPaths.push(z);
    }
  });

  return { directories, bwhPaths }
}

const readBwh = (bwhPaths: string[]) => {
  const parser = new BwhParser();
  bwhPaths.forEach(filename => {
    const buff = readFileSync(join(ZONES_DIR, filename));
    const bwh = parser.parse(buff, filename, buff.byteLength);
    writeBwhJson(bwh);
  });
}

const readBfwd = (directory: string, filesToRead: string[]) => {
  const parser = new BfwdParser();
  const dirPath = join(ZONES_DIR, directory);
  const entries = readdirSync(dirPath);
  const bfwdPaths = entries.filter(f => f.toLowerCase().endsWith('.bfwd') && filesToRead.includes(f));
  bfwdPaths.forEach(file => {
    const buff = readFileSync(join(dirPath, file));
    const bfwd = parser.parse(buff, file, buff.byteLength);
    writeBfwdJson(bfwd, directory);
  })
}

const writeBwhJson = (bwh: BWH) => {
  const filename = bwh.filename.toLowerCase().replace('.bwh', '.json');
  writeFileSync(join(base.paths.CACHE, filename), JSON.stringify(bwh), { encoding: 'utf8' });
}

const writeBfwdJson = (bwfd: BFWD, directory: string) => {
  const filename = bwfd.filename.toLowerCase().replace('.bfwd', '.json');
  ensureDirSync(join(base.paths.CACHE, directory));
  writeFileSync(join(base.paths.CACHE, directory, filename), JSON.stringify(bwfd.fieldCells.map(c => c.cellType1)), { encoding: 'utf8' });
}

const isBwhCached = (bwhFiles: string[]) => {
  const cacheDir = readdirSync(base.paths.CACHE);
  const bwhCacheFiles = cacheDir.filter(z => z.toLowerCase().endsWith('.json'));
  const nonCachedFiles = bwhFiles.filter(f => !bwhCacheFiles.includes(f.toLowerCase().replace('.bwh', '.json')));
  return nonCachedFiles;
}

const isBfwdCached = (directories: string[]) => {
  return directories.map(directory => {
    const baseDir = readdirSync(join(ZONES_DIR, directory));
    const bfwdFilenames = baseDir.filter(b => b.toLowerCase().endsWith('.bfwd'));
    try {
      const cacheDir = readdirSync(join(base.paths.CACHE, directory));
      const bfwdCacheFiles = cacheDir.filter(z => z.toLowerCase().endsWith('.json'));
      const nonCachedFiles = bfwdFilenames.filter(f => !bfwdCacheFiles.includes(f.toLowerCase().replace('.bfwd', '.json')));
      return { directory, bfwdFilenames: nonCachedFiles };
    } catch (_) {
      return { directory, bfwdFilenames }
    }
  })
}

export const setupCache = () => {
  const { directories, bwhPaths } = readZones();
  const bwhMissingFiles = isBwhCached(bwhPaths);
  readBwh(bwhMissingFiles);
  const bfwdMissingFiles = isBfwdCached(directories);
  return bfwdMissingFiles.map(missing => readBfwd(missing.directory, missing.bfwdFilenames));
}

export const loadBwhJson = async (bwhFilename: string) => {
  const filename = bwhFilename.toLowerCase().replace('.bwh', '.json');
  const bwhString = await readFile(join(base.paths.CACHE, filename), { encoding: 'utf8' });
  return JSON.parse(bwhString) as BWH;
}

export const loadBfwdJson = (bfwdFilename: string, directory: string) => {
  const filename = bfwdFilename.toLowerCase().replace('.bfwd', '.json');
  const bfwdString = readFileSync(join(base.paths.CACHE, directory, filename), { encoding: 'utf8' });
  return JSON.parse(bfwdString);
}