import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import log from './log';

import createJsBundleFile from './create-js-bundle-file';

import readFile from './read-file';

const createBinaryCreatorFile = async (binaryFileArch, binaryFilePath, options) => {
  const runtimeFilename = `runtime-${Date.now()}${Math.random()}.js`;

  const runtimeFilePath = resolve('.', runtimeFilename);

  const {
    scripts: scriptsPaths,

    styles: stylesPaths,
  } = options || {};

  const [
    mainScript = '',

    scripts = '',

    styles = '',
  ] = await Promise.all([
    createJsBundleFile(
      {
        input: resolve('./src/node/launch-browser.js'),

        plugins: [
          commonjs(),
        ],

        external: ['puppeteer'],
      },

      {
        exports: 'default',
        name: 'launchBrowser',
        format: 'cjs',
      },
    ),

    readFile(scriptsPaths),

    readFile(stylesPaths),
  ]);

  log('log', scripts);

  log('log', styles);

  await writeFile(
    runtimeFilePath,

    `${mainScript}\n\nlaunchBrowser(${JSON.stringify({
      ...options,

      scripts,

      styles,
    })});`,
  );

  try {
    await exec([
      `./${runtimeFilename}`,

      '--config',
      './pkg.json',

      '--compress',
      'GZip',

      '--target',
      binaryFileArch,

      '--output',
      binaryFilePath,
    ]);
  } catch (e) {
    await log('error', e);
  }

  await unlink(runtimeFilePath);
};

export default createBinaryCreatorFile;
