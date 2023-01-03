import argv from 'argv';
import { exec } from 'pkg';
import { writeFile, unlink } from 'fs/promises';
import { dirname, basename, resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import createRollup from './utils/create-rollup';
import generateId from './utils/generate-id';
import getPuppeteerBrowserPlatform from './utils/get-puppeteer-browser-platform';
import { STRING_EXECUTED_FILE_WORKING_DIR_PATH } from './constants';

const { option: parseBuildCliArgs } = argv;

const {
  options: buildCliArgs,

  targets: buildCliTargets,
} = parseBuildCliArgs([
  {
    name: 'browser-executable-path',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --browser-executable-path=/path/to/chromium'",
  },
  {
    name: 'browser-user-data-dir',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --browser-user-data-dir=/path/to/browser/user/data'",
  },
  {
    name: 'browser-product',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --browser-product=firefox'",
  },
  {
    name: 'browser-revision',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --browser-revision=123456'",
  },
  {
    name: 'browser-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-web-browser --browser-args=--some-args'",
  },
  {
    name: 'browser-ignore-default-args',
    type: 'csv',
    description: ' ',
    example: "'pkg-web-browser --browser-ignore-default-args=--default-arg-to-be-ignored'",
  },
  {
    name: 'pkg-target',
    type: 'string',
    description: 'Defines the final program architecture',
    example: "'pkg-web-browser --pkg-target=node16-macos-x64'",
  },
  {
    name: 'pkg-entrypoint',
    type: 'string',
    description: 'Defines the app to be boundled entrypoint',
    example: "'pkg-web-browser --pkg-entrypoint=./path/to/app.js'",
  },
]).run();

const {
  'browser-executable-path': puppeteerBrowserExecutablePath,

  'browser-user-data-dir': puppeteerBrowserUserDataDir = '',

  'browser-product': puppeteerBrowserProduct,

  'browser-revision': puppeteerBrowserRevision,

  'browser-args': puppeteerBrowserArgs = [],

  'browser-ignore-default-args': puppeteerBrowserIgnoreDefaultArgs = [],

  'pkg-target': pkgOutputFileArchitecture = 'host',

  'pkg-entrypoint': pkgAppEntrypointFile = '',
} = buildCliArgs || {};

let puppeteerBrowserProductClean = puppeteerBrowserProduct;

if (puppeteerBrowserProduct !== 'chrome' || puppeteerBrowserProduct !== 'firefox') {
  puppeteerBrowserProductClean = 'chrome';
}

let puppeteerBrowserRevisionClean = puppeteerBrowserRevision;

if (puppeteerBrowserProductClean === 'chrome' && !puppeteerBrowserRevisionClean) {
  puppeteerBrowserRevisionClean = '1018312';
}

if (puppeteerBrowserProductClean === 'firefox' && !puppeteerBrowserRevisionClean) {
  puppeteerBrowserRevisionClean = '98.0a1';
}

const [
  url = 'https://localhost:80',

  binaryFilePath = '.',
] = buildCliTargets || [];

(async () => {
  let pkgEnvDynamicallyGeneratedCommandString = await createRollup(
    {
      input: resolve(

        STRING_EXECUTED_FILE_WORKING_DIR_PATH,

        '../src/lib.js',
      ),

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
      // exports: 'default',
      format: 'cjs',
    },
  );

  pkgEnvDynamicallyGeneratedCommandString += `
    (async () => {
  `;

  const instanceId = generateId();

  pkgEnvDynamicallyGeneratedCommandString += `
    const executablePath = await getPuppeteerBrowserExecutablePath(
      "${puppeteerBrowserProductClean}",

      "${getPuppeteerBrowserPlatform(pkgOutputFileArchitecture)}",

      "${puppeteerBrowserRevisionClean}",

      "${puppeteerBrowserExecutablePath}",
    );
  `;

  let dynamicallyGeneratedPkgEntrypointFilePath = resolve(

    STRING_EXECUTED_FILE_WORKING_DIR_PATH,

    '..',

    instanceId,
  );

  if (pkgAppEntrypointFile) {
    dynamicallyGeneratedPkgEntrypointFilePath = resolve(
      // NOTE: the build execution command line folder path,
      // where the pkg-web-browser command is called
      process.cwd(),

      basename(pkgAppEntrypointFile),
    );

    pkgEnvDynamicallyGeneratedCommandString += `
      require("./${basename(dynamicallyGeneratedPkgEntrypointFilePath)}");
    `;
  }

  dynamicallyGeneratedPkgEntrypointFilePath = resolve(
    dirname(dynamicallyGeneratedPkgEntrypointFilePath),

    `${instanceId}.js`,
  );

  const dynamicallyGeneratedPkgConfigFilePath = resolve(
    dirname(dynamicallyGeneratedPkgEntrypointFilePath),

    `${instanceId}.json`,
  );

  pkgEnvDynamicallyGeneratedCommandString += `
    const haltApplication = () => process.exit();

    try {
      const browser = await launchPuppeteerBrowser(
        "${url}",

        executablePath,

        "${puppeteerBrowserUserDataDir}",

        "${puppeteerBrowserProductClean}",

        ${JSON.stringify(puppeteerBrowserArgs)},

        ${JSON.stringify(puppeteerBrowserIgnoreDefaultArgs)}
      );

      browser.on('disconnected', haltApplication);
    }catch(e){
      console.warn("The following error was thrown during browser launch, please close any other browser instance and try again.");
      
      console.error(e);

      haltApplication();
    }
  `;

  pkgEnvDynamicallyGeneratedCommandString += '})();';

  await Promise.all([
    writeFile(
      dynamicallyGeneratedPkgEntrypointFilePath,

      pkgEnvDynamicallyGeneratedCommandString,
    ),

    writeFile(
      dynamicallyGeneratedPkgConfigFilePath,

      JSON.stringify({}),
    ),
  ]);

  await exec([
    dynamicallyGeneratedPkgEntrypointFilePath,

    '--config',
    dynamicallyGeneratedPkgConfigFilePath,

    '--target',
    pkgOutputFileArchitecture,

    '--output',
    binaryFilePath,
  ]);

  await Promise.all([
    unlink(dynamicallyGeneratedPkgEntrypointFilePath),

    unlink(dynamicallyGeneratedPkgConfigFilePath),
  ]);
})();
