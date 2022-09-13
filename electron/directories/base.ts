import { homedir } from 'os';
import { join } from 'path';
import { ensureDir, ensureFile, readFile } from 'fs-extra';

const HOME = homedir();
const BASE = join(HOME, 'map-editor');
const CACHE = join(BASE, '.cache');
const PROJECTS = join(BASE, 'projects');
const CONFIG = join(BASE, 'config.json');

const ensureDirTasks = [ensureDir(BASE), ensureDir(CACHE), ensureDir(PROJECTS), ensureFile(CONFIG)];

const base = {
  paths: {
    CACHE,
    PROJECTS
  },
  config: {}
}

export default base;

export const setupBase = async () => {
  await Promise.all(ensureDirTasks);
  const fileData = await readFile(CONFIG, { encoding: 'utf8' });
  try {
    base.config = JSON.parse(fileData)
  } catch (_) {
    base.config = {}
  }
}
