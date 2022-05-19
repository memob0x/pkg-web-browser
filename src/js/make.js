import pkg from 'argv';

import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import { resolve } from 'path';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import log from './utils/log';
import transpileScss from './utils/transpile-scss';

import rollupJs from './utils/rollup-js';

import { PATH_SRC } from '../../paths';
import { STRING_INJECTED_FLAG_NAME } from './constants';
import readFileUtf8 from './utils/read-file-utf8';

const { option } = pkg;

const { options, targets } = option([
  {
    name: 'browser-width',
    type: 'int',
    description: 'Defines the opened website viewport width',
    example: "'pkg-browser-gamepad --browser-width=720'",
  },
  {
    name: 'browser-height',
    type: 'int',
    description: 'Defines the opened website viewport height',
    example: "'pkg-browser-gamepad --browser-height=576'",
  },
  {
    name: 'browser-executable-path',
    type: 'string',
    description: 'Defines the used browser executable path',
    example: "'pkg-browser-gamepad --browser-executable-path=/usr/bin/chromium-browser'",
  },
  {
    name: 'browser-user-data-dir',
    type: 'string',
    description: 'Defines the used browser path',
    example: "'pkg-browser-gamepad --browser-user-data-dir=/home/user/.config/chromium/Default'",
  },
  {
    name: 'kiosk',
    type: 'boolean',
    description: 'Defines whether the final program should open in kiosk mode or not',
    example: "'pkg-browser-gamepad --kiosk'",
  },
  {
    name: 'focus',
    type: 'boolean',
    description: 'Defines whether the final program should always stay on top disallowing other pages opening (popups)',
    example: "'pkg-browser-gamepad --focus'",
  },
  {
    name: 'pkg-target',
    type: 'string',
    description: 'Defines the final program architecture',
    example: "'pkg-browser-gamepad --pkg-target=node16-macos-x64'",
  },
  {
    name: 'loop-interval-time',
    type: 'string',
    description: 'Defines the final program internal process frequency time (in ms) for it to compute updates',
    example: "'pkg-browser-gamepad --loop-interval-time=6000'",
  },
  {
    name: 'custom-scripts',
    type: 'string',
    description: ' ',
    example: "'pkg-browser-gamepad --custom-scripts=./script-1.css,./script-2.css'",
  },
  {
    name: 'custom-styles',
    type: 'string',
    description: ' ',
    example: "'pkg-browser-gamepad --custom-styles=./style-1.css,./style-2.css'",
  },
]).run();

const {
  'browser-executable-path': executablePath,

  'browser-user-data-dir': userDataDir,

  'browser-width': width = 1920,

  'browser-height': height = 1080,

  kiosk = false,

  focus = false,

  'pkg-target': pkgTarget = 'host',

  'loop-interval-time': loopIntervalTime = 75,

  'custom-scripts': customScripts = '',

  'custom-styles': customStyles = '',
} = options || {};

const [
  url = '//localhost',

  output = '',
] = targets || [];

(async () => {
  const runtimeFilePrefix = 'runtime-';
  const runtimeFileExtension = '.js';

  const runtimeFilename = `${runtimeFilePrefix}${Date.now()}${Math.random()}${runtimeFileExtension}`;

  const runtimeFile = resolve('.', runtimeFilename);

  const [cssMain, jsBrowserGamepadSupport, jsLaunchBrowser, extraJs = '', extraCss = ''] = await Promise.all([
    transpileScss(resolve(PATH_SRC, 'scss', 'main.scss')),

    rollupJs({
      input: {
        input: resolve(PATH_SRC, 'js', 'browser.js'),

        plugins: [
          commonjs(),

          nodeResolve(),
        ],
      },

      output: {
        format: 'iife',

        name: STRING_INJECTED_FLAG_NAME,
      },
    }),

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

    kiosk,

    focus,

    css: cssMain + extraCss,

    js: jsBrowserGamepadSupport + extraJs,

    loopIntervalTime,
  };

  await writeFile(
    runtimeFile,

    `${jsLaunchBrowser}\n\nlaunchBrowser(${JSON.stringify(url)}, ${JSON.stringify(launchBrowserOptions)});`,
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
