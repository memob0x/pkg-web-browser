import { exec } from 'pkg';

import { writeFile, unlink, rm } from 'fs/promises';

import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import log from './log';

import createJsBundleFile from './create-js-bundle-file';

import readFile from './read-file';
import generateId from '../utils/generate-id';
import downloadBrowser from './download-browser';
import awaitSafely from '../utils/await-safely';

const createBinaryFile = async (binaryFileArch, binaryFilePath, options) => {
  const {
    scripts: scriptsPaths,

    styles: stylesPaths,

    executablePath: executablePathOpt,
  } = options || {};

  const runtimeId = generateId();

  const runtimeFileName = `runtime-${runtimeId}.js`;

  const runtimeFilePath = resolve('.', runtimeFileName);

  const localBrowserFolderName = `local-browser-${runtimeId}`;

  const localBrowserFolderPath = resolve('.', localBrowserFolderName);

  const [
    executablePath = '',

    mainScript = '',

    scripts = '',

    styles = '',
  ] = await Promise.all([
    executablePathOpt || downloadBrowser(localBrowserFolderPath),

    createJsBundleFile(
      {
        input: resolve('./src/node/launch-browser.js'),

        plugins: [
          commonjs(),
        ],

        external: [
          'puppeteer-core',

          'path',
        ],
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

  await log('log', scripts);

  await log('log', styles);

  await writeFile(
    runtimeFilePath,

    `${mainScript}\n\nlaunchBrowser(${JSON.stringify({
      ...options,

      isLocalBrowser: !executablePathOpt,

      localBrowserFolderName,

      localBrowserFolderPath,

      executablePath,

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

  await awaitSafely(Promise.all([
    unlink(runtimeFilePath),

    rm(localBrowserFolderPath, {
      recursive: true,
    }),
  ]));
};

export default createBinaryFile;
