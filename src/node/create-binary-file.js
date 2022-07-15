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

  // NOTE: must be relative to {workspaceFolder}/dist folder
  const runtimeFilePath = resolve(__dirname, '..', runtimeFileName);

  const [
    mainScript = '',

    scripts = '',

    styles = '',
  ] = await Promise.all([
    createJsBundleFile(
      {
        // NOTE: must be relative to {workspaceFolder}/dist folder
        input: resolve(__dirname, '../src/node/launch-browser.js'),

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
    // NOTE: must be relative to {workspaceFolder}/dist folder
    resolve(__dirname, `../${runtimeFileName}`),

    '--debug',

    '--config',
    // NOTE: must be relative to {workspaceFolder}/dist folder
    resolve(__dirname, '../pkg.json'),

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
