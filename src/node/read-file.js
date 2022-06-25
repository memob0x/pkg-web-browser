import { readFile as nodeReadFile } from 'fs/promises';
import { resolve } from 'path';

const readFile = async (path) => {
  if (Array.isArray(path)) {
    return path.reduce(
      async (previous, current) => await previous + await readFile(current),

      Promise.resolve(''),
    );
  }

  try {
    return await nodeReadFile(
      resolve(path),

      { encoding: 'utf8' },
    );
  } catch (e) {
    return '';
  }
};

export default readFile;
