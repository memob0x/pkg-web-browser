const argv = require('argv');

const { exec } = require('pkg');

const { writeFile, unlink } = require('fs/promises');
const readFileUtf8 = require('./src/js/read-file-utf8');

const { options } = argv.option([
  {
    name: 'url',
    short: 'u',
    type: 'string',
    description: 'Defines the opened website url',
    example: "'script --url=//website.org' or 'script -u //website.org'",
  },
  {
    name: 'width',
    short: 'vw',
    type: 'int',
    description: 'Defines the opened website viewport width',
    example: "'script --width=720' or 'script -w 720'",
  },
  {
    name: 'height',
    short: 'vh',
    type: 'int',
    description: 'Defines the opened website viewport height',
    example: "'script --height=576' or 'script -h 576'",
  },
  {
    name: 'browser',
    short: 'b',
    type: 'string',
    description: 'Defines the used browser executable path',
    example: "'script --browser=/usr/bin/chromium-browser' or 'script -b /usr/bin/chromium-browser'",
  },
  {
    name: 'profile',
    short: 'p',
    type: 'string',
    description: 'Defines the used browser path',
    example: "'script --profile=/home/user/.config/chromium/Default' or 'script -p /home/user/.config/chromium/Default'",
  },
  {
    name: 'target',
    short: 't',
    type: 'string',
    description: 'Defines the final program architecture',
    example: "'script --target=node16-macos-x64' or 'script -t node16-macos-x64'",
  },
  {
    name: 'output',
    short: 'o',
    type: 'string',
    description: 'Defines the final program output file',
    example: "'script --output=/my/dist/path/test.exe' or 'script -o /my/dist/path/test.exe'",
  },
  {
    name: 'kiosk',
    short: 'k',
    type: 'boolean',
    description: 'Defines whether the final program should open in kiosk mode or not',
    example: "'script --kiosk or 'script -k'",
  },
]).run();

const {
  url = '//localhost',

  width = 1920,

  height = 1080,

  browser,

  profile,

  target = 'host',

  output = '',

  kiosk,
} = options || {};

(async () => {
  const runtimeFilename = `runtime-${Date.now()}.js`;

  const runtimeFile = `${__dirname}/${runtimeFilename}`;

  const runtimeCssCodeToBeInjected = await readFileUtf8('./dist/style.css');

  const runtimeJsCodeToBeInjected = await readFileUtf8('./dist/scripts.js');

  await writeFile(
    runtimeFile,

    `require('./src/js/launch-browser')(
      ${JSON.stringify(url)},
      
      ${width},
      
      ${height},
      
      ${JSON.stringify(browser)},
      
      ${JSON.stringify(profile)},
      
      ${kiosk},

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
      target,

      '--output',
      output,
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  await unlink(runtimeFile);
})();
