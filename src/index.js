import argv from 'argv';
import createBinaryFile from './node/create-binary-file';

const { option } = argv;

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
    example: "'pkg-browser --browser-product=firefox'",
  },
  {
    name: 'browser-download-host',
    type: 'string',
    description: ' ',
    example: "'pkg-browser --browser-download-host=https://foo.bar/path/to/official/browser/repo'",
  },
  {
    name: 'browser-download-path',
    type: 'string',
    description: ' ',
    example: "'pkg-browser --browser-download-path=/path/to/the/browser/downloads'",
  },
  {
    name: 'browser-revision',
    type: 'string',
    description: ' ',
    example: "'pkg-browser --browser-revision=123456'",
  },
  {
    name: 'browser-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --browser-args=--some-args'",
  },
  {
    name: 'browser-ignore-default-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-browser --browser-ignore-default-args=--default-arg-to-be-ignored'",
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

  'browser-download-host': downloadHost,

  'browser-download-path': downloadPath,

  'browser-revision': revision,

  'browser-args': args = [],

  'browser-ignore-default-args': ignoreDefaultArgs = [],

  focus = false,

  'pkg-target': binaryFileArch = 'host',

  'custom-scripts': scripts = '',

  'custom-styles': styles = '',
} = options || {};

const [
  url = '',

  binaryFilePath = '',
] = targets || [];

createBinaryFile(
  binaryFileArch,

  binaryFilePath,

  {
    styles,

    scripts,

    url,

    executablePath,

    userDataDir,

    defaultViewport: {
      width,

      height,
    },

    product,

    downloadHost,

    downloadPath,

    revision,

    binaryFileArch,

    args,

    ignoreDefaultArgs,

    focus,
  },
);
