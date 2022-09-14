import { ipcMain } from 'electron';
import { readdir, readFile } from 'fs-extra';
import { join } from 'path';
import { MAIN_DIR, MINIMAP_DIR, ZONES_DIR } from '../../shared/paths';
import { BfwdParser } from '../parsers/bfwd';
import { BwhParser } from '../parsers/bwh';
import { loadBfwdJson, loadBwhJson } from './cache';

const MINIMAP_NAME_REGEX = /[A-Z_]+z\d{1,3}x\d{1,3}_Mini[mM]ap\.bmp/

type DirectoryRefs = {
  [key: string]: {
    path: string,
    entries?: string[]
  }
}

const dirRefs: DirectoryRefs = {
  main: {
    path: MAIN_DIR
  },
  zones: {
    path: ZONES_DIR
  },
  minimap: {
    path: MINIMAP_DIR
  }
};

const dirCache: DirectoryRefs = {};

const readDir = async (ref: DirectoryRefs, key: string) => {
  ref[key].entries = await readdir(ref[key].path);
}

export const setupDirs = async () =>
  Promise.all(Object.keys(dirRefs).map(key => readDir(dirRefs, key)));

export const getMinimapFiles = async (mapName: string) => {
  // if its not a valid minimap name
  if (!dirRefs.minimap.entries?.includes(mapName)) throw 'Invalid map name';

  // if the minimap has been cached, no need to fetch it again
  if (!dirCache[mapName]) {
    dirCache[mapName] = {
      path: join(MINIMAP_DIR, mapName)
    };
    await readDir(dirCache, mapName);
  }

  return dirCache[mapName].entries?.filter(e => MINIMAP_NAME_REGEX.test(e)) || [];
}

export const getZones = () =>
  dirRefs.zones.entries?.filter(e => !e.toLowerCase().endsWith('.xml') && !e.toLowerCase().endsWith('.bwh'));

export const getBwh = async (mapName: string) => {
  const fileName = `${mapName}.bwh`;
  if (!dirRefs.zones.entries?.includes(fileName)) throw 'Invalid map name';

  const parser = new BwhParser();
  const file = await readFile(join(ZONES_DIR, fileName));
  return parser.parse(file, fileName, file.byteLength);
}

export const getBfwd = async (mapName: string, bfwdName: string) => {
  if (!dirRefs.zones.entries?.includes(mapName)) throw 'Invalid map name';
  const mapDirectory = join(ZONES_DIR, mapName);
  const directoryData = await readdir(mapDirectory);
  const fileName = `${bfwdName}.bfwd`;

  if (!directoryData.includes(fileName)) throw 'Invalid bfwd name';

  const parser = new BfwdParser();
  const file = await readFile(join(mapDirectory, fileName));
  return parser.parse(file, fileName, file.byteLength);
}

export const directoryLoadingListeners = () => {
  ipcMain.on('get-minimap', async (event, mapName) => {
    try {
      event.returnValue = await getMinimapFiles(mapName);
    } catch (err) {
      event.returnValue = err;
    }
  })

  ipcMain.on('get-bwfd', async (event, { mapName, bfwdName }: { mapName: string, bfwdName: string }) => {
    try {
      event.returnValue = await getBfwd(mapName, bfwdName);
    } catch (err) {
      event.returnValue = err;
    }
  });
}

export const assembleBwh = async (mapName: string) => {
  const bwh = await loadBwhJson(mapName + '.bwh');
  const bfwdNames = bwh.zone.filter(z => z.is_active).map(z => z.name.split('\u0000')[0]);
  bwh.minimap = await getMinimapFiles(mapName);
  const cells: { [key: string]: number[] } = {};
  bfwdNames.map(name => {
    cells[name] = loadBfwdJson(name + '.bfwd', mapName);
  });
  bwh.bfwdCells = cells;
  return bwh;
}