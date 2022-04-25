const argv = require('argv');

const { exec } = require('pkg');

const { writeFile, unlink } = require('fs/promises');
const readFileUtf8 = require('./src/js/read-file-utf8');
const log = require('./src/js/log');

const { options, targets } = argv.option([
  {
    name: 'viewport-width',
    type: 'int',
    description: 'Defines the opened website viewport viewport-width',
    example: "'pkg-browser-gamepad --viewport-width=720'",
  },
  {
    name: 'viewport-height',
    type: 'int',
    description: 'Defines the opened website viewport viewport-height',
    example: "'pkg-browser-gamepad --viewport-height=576'",
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
    name: 'pkg-target',
    type: 'string',
    description: 'Defines the final program architecture',
    example: "'pkg-browser-gamepad --pkg-target=node16-macos-x64'",
  },
  {
    name: 'browser-window-mode',
    type: 'string',
    description: 'Defines whether the final program should open in kiosk mode or other modes',
    example: "'pkg-browser-gamepad --browser-window-mode=kiosk'",
  },
]).run();

const {
  'browser-executable-path': browserExecutablePath,

  'browser-user-data-dir': browserUserDataDir,

  'viewport-width': viewportWidth = 1920,

  'viewport-height': viewportHeight = 1080,

  'pkg-target': pkgTarget = 'host',

  'browser-window-mode': browserWindowMode = 'kiosk',
} = options || {};

const [
  url = '//localhost',

  output = '',
] = targets || [];

(async () => {
  const runtimeFilename = `runtime-${performance.now() + Math.random()}.js`;

  const runtimeFile = `${__dirname}/${runtimeFilename}`;

  const runtimeCssCodeToBeInjected = await readFileUtf8('./dist/style.css');

  const runtimeJsCodeToBeInjected = await readFileUtf8('./dist/scripts.js');

  await writeFile(
    runtimeFile,

    `require('./src/js/launch-browser')(
      ${JSON.stringify(url)},
      
      ${viewportWidth},
      
      ${viewportHeight},
      
      ${JSON.stringify(browserExecutablePath)},
      
      ${JSON.stringify(browserUserDataDir)},
      
      ${JSON.stringify(browserWindowMode)},

      ${JSON.stringify(runtimeCssCodeToBeInjected)},

      ${JSON.stringify(runtimeJsCodeToBeInjected)},
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

  await unlink(runtimeFile);
})();
