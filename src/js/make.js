import pkg from 'argv';

import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import { resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import log from './utils/log';

import rollupJs from './utils/rollup-js';

import { PATH_SRC } from '../../paths';
import readFileUtf8 from './utils/read-file-utf8';

const { option } = pkg;

const { options, targets } = option([
  {
    name: 'browser-width',
    type: 'int',
    description: 'Defines the opened website viewport width',
    example: "'pkg-browser --browser-width=720'",
  },
  {
    name: 'browser-height',
    type: 'int',
    description: 'Defines the opened website viewport height',
    example: "'pkg-browser --browser-height=576'",
  },
  {
    name: 'browser-executable-path',
    type: 'string',
    description: 'Defines the used browser executable path',
    example: "'pkg-browser --browser-executable-path=/usr/bin/chromium-browser'",
  },
  {
    name: 'browser-user-data-dir',
    type: 'string',
    description: 'Defines the used browser path',
    example: "'pkg-browser --browser-user-data-dir=/home/user/.config/chromium/Default'",
  },
  {
    name: 'browser-product',
    type: 'string',
    description: ' ',
    example: "'pkg-browser --args'",
  },
  {
    name: 'browser-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --args'",
  },
  {
    name: 'browser-ignore-default-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --args'",
  },
  {
    name: 'focus',
    type: 'boolean',
    description: 'Defines whether the final program should always stay on top disallowing other pages opening (popups)',
    example: "'pkg-browser --focus'",
  },
  {
    name: 'pkg-target',
    type: 'string',
    description: 'Defines the final program architecture',
    example: "'pkg-browser --pkg-target=node16-macos-x64'",
  },
  {
    name: 'loop-interval-time',
    type: 'string',
    description: 'Defines the final program internal process frequency time (in ms) for it to compute updates',
    example: "'pkg-browser --loop-interval-time=6000'",
  },
  {
    name: 'custom-scripts',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --custom-scripts=./script-1.css,./script-2.css'",
  },
  {
    name: 'custom-styles',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --custom-styles=./style-1.css,./style-2.css'",
  },
]).run();

const {
  'browser-executable-path': executablePath,

  'browser-user-data-dir': userDataDir,

  'browser-width': width = 1920,

  'browser-height': height = 1080,

  'browser-product': product,

  'browser-args': args = [],

  'browser-ignore-default-args': ignoreDefaultArgs = [],

  focus = false,

  'pkg-target': pkgTarget = 'host',

  'loop-interval-time': loopIntervalTime = 75,

  'custom-scripts': customScripts = '',

  'custom-styles': customStyles = '',
} = options || {};

const [
  output = '',
] = targets || [];

(async () => {
  const runtimeFilePrefix = 'runtime-';
  const runtimeFileExtension = '.js';

  const runtimeFilename = `${runtimeFilePrefix}${Date.now()}${Math.random()}${runtimeFileExtension}`;

  const runtimeFile = resolve('.', runtimeFilename);

  const [jsMainInNode, extraJs = '', extraCss = ''] = await Promise.all([
    rollupJs({
      input: {
        input: resolve(PATH_SRC, 'js', 'utils', 'launch-browser.js'),

        plugins: [
          commonjs(),
        ],

        external: ['puppeteer'],
      },

      output: {
        exports: 'default',
        name: 'launchBrowser',
        format: 'cjs',
      },
    }),

    readFileUtf8(customScripts),

    readFileUtf8(customStyles),
  ]);

  const launchBrowserOptions = {
    executablePath,

    userDataDir,

    width,

    height,

    product,

    args,

    ignoreDefaultArgs,

    focus,

    css: extraCss,

    js: extraJs,

    loopIntervalTime,
  };

  await writeFile(
    runtimeFile,

    `${jsMainInNode}\n\nlaunchBrowser(${JSON.stringify(launchBrowserOptions)});`,
  );

  try {
    await exec([
      `./${runtimeFilename}`,

      '--config',
      './pkg.json',

      '--compress',
      'GZip',

      '--target',
      pkgTarget,

      '--output',
      output,
    ]);
  } catch (e) {
    log('error', e);
  }

  await unlink(`./${runtimeFilename}`);
})();
