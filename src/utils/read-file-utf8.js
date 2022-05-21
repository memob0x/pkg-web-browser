import { readFile } from 'fs/promises';
import { resolve } from 'path';

const readFileUtf8 = async (path) => {
  if (Array.isArray(path)) {
    return path.reduce(async (previous, current) => previous + await readFileUtf8(current), '');
  }

  try {
    return await readFile(resolve(path), { encoding: 'utf8' });
  } catch (e) {
    return '';
  }
};

export default readFileUtf8;
