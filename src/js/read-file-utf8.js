import { readFile } from 'fs/promises';

const readFileUtf8 = async (x) => {
  try {
    return await readFile(x, { encoding: 'utf8' });
  } catch (e) {
    return '';
  }
};

export default readFileUtf8;
