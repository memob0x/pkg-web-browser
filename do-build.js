import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import {
  url,

  width,

  height,

  browser,

  data,

  target,

  output,
} from './arguments';

(async () => {
  try {
    await writeFile('runtime.js', `import launch from "./launch.js"; launch(${url}, ${width}, ${height}, ${browser}, ${data})`);

    await exec(['runtime.js', '--target', target, '--output', output]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    await unlink('runtime.js');
  }
})();
