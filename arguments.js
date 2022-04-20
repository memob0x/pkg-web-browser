const argv = require('argv');

const { options } = argv.option([
  {
    name: 'url',
    short: 'u',
    type: 'string',
    description: 'Defines the opened website url',
    example: "'script --url=http://google.com' or 'script -u http://google.com'",
  },
  {
    name: 'width',
    short: 'w',
    type: 'int',
    description: 'Defines the opened website viewport width',
    example: "'script --width=720' or 'script -w 720'",
  },
  {
    name: 'height',
    short: 'h',
    type: 'int',
    description: 'Defines the opened website viewport height',
    example: "'script --height=576' or 'script -h 576'",
  },
  {
    name: 'browser',
    short: 'b',
    type: 'string',
    description: 'Defines the used browser path',
    example: "'script --browser=/usr/bin/chromium-browser' or 'script -b /usr/bin/chromium-browser'",
  },
  {
    name: 'data',
    short: 'd',
    type: 'string',
    description: 'Defines the used browser path',
    example: "'script --data=/home/user/.config/chromium/Default' or 'script -d /home/user/.config/chromium/Default'",
  },
  {
    name: 'target',
    short: 't',
    type: 'string',
    description: 'Defines the final program architecture',
    // node(14|16...)-(macos|linux|win)-(x64|arm64...)
    example: "'script --target=node16-macos-x64' or 'script -t node16-macos-x64'",
  },
  {
    name: 'output',
    short: 'o',
    type: 'string',
    description: 'Defines the final program output file',
    example: "'script --output=/my/dist/path/test.exe' or 'script -o /my/dist/path/test.exe'",
  },
]).run();

const {
  url,

  width = 1920,

  height = 1080,

  browser,

  data,

  target = 'host',

  output = 'test.exe',
} = options || {};

module.exports = {
  url,

  width,

  height,

  browser,

  data,

  target,

  output,
};
