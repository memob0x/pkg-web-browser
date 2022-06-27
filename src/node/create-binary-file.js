import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import log from './log';

import createJsBundleFile from './create-js-bundle-file';

import readFile from './read-file';
import generateId from '../utils/generate-id';

const createBinaryFile = async (binaryFileArch, binaryFilePath, options) => {
  const {
    scripts: scriptsPaths,

    styles: stylesPaths,
  } = options || {};

  const runtimeId = generateId();

  const runtimeFileName = `runtime-${runtimeId}.js`;

  const runtimeFilePath = resolve('.', runtimeFileName);

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

        external: [
          'puppeteer-core',

          'path',

          'fs/promises',
        ],
      },

      {
        exports: 'default',
        format: 'cjs',
      },
    ),

    readFile(scriptsPaths),

    readFile(stylesPaths),
  ]);

  await log('log', scripts);

  await log('log', styles);

  await writeFile(
    runtimeFilePath,

    `${mainScript}\n\nlaunchBrowser(${JSON.stringify({
      ...options,

      scripts,

      styles,
    })});`,
  );

  await exec([
    `./${runtimeFileName}`,

    '--debug',

    '--config',
    './pkg.json',

    '--compress',
    'GZip',

    '--target',
    binaryFileArch,

    '--output',
    binaryFilePath,
  ]);

  await unlink(runtimeFilePath);
};

export default createBinaryFile;
