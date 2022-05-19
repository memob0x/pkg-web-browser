import { readFile } from 'fs/promises';
import { resolve } from 'path';

const readFileUtf8 = async (path) => {
  if (typeof path === 'string' && path.includes(',')) {
    return readFileUtf8(path.split(','));
  }

  if (Array.isArray(path)) {
    return path.reduce((previous, current) => previous + readFileUtf8(current), '');
  }

  try {
    return await readFile(resolve(path), { encoding: 'utf8' });
  } catch (e) {
    return '';
  }
};

export default readFileUtf8;