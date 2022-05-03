import pkg from 'argv';

import { exec } from 'pkg';

import { writeFile, unlink } from 'fs/promises';

import { resolve } from 'path';

import log from './js/log';
import readFileUtf8 from './js/read-file-utf8';

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
} = options || {};

const [
  url = '//localhost',

  output = '',
] = targets || [];

const run = async () => {
  const runtimeFilePrefix = 'runtime-';
  const runtimeFileExtension = '.js';

  const runtimeFilename = `${runtimeFilePrefix}${Date.now()}${Math.random()}${runtimeFileExtension}`;

  const runtimeFile = resolve('.', runtimeFilename);

  // runtimeCssCodeToBeInjected
  const [css, js] = await Promise.all([
    readFileUtf8('./dist/style.css'),

    // runtimeJsCodeToBeInjected
    readFileUtf8('./dist/scripts.js'),
  ]);

  await writeFile(
    runtimeFile,

    `require('./dist/launch-browser.cjs')(${JSON.stringify(url)}, ${JSON.stringify({
      executablePath,

      userDataDir,

      width,

      height,

      kiosk,

      focus,

      css,

      js,

      loopIntervalTime,
    })}
    );`,
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
};

run();
