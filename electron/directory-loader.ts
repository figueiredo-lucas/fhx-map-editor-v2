import { ipcMain } from 'electron';
import * as fs from 'fs/promises';
import { join } from 'path';
import { MAIN_DIR, MINIMAP_DIR, ZONES_DIR } from '../shared/paths';

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
  ref[key].entries = await fs.readdir(ref[key].path);
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
  dirRefs.zones.entries?.filter(e => /.*[^\.xml|^\.bwh]$/i.test(e));

export const directoryLoadingListeners = () => {
  ipcMain.on('get-minimap', async (event, mapName) => {
    event.returnValue = await getMinimapFiles(mapName);
  })
}