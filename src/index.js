import argv from 'argv';
import { exec } from 'pkg';
import { writeFile, unlink } from 'fs/promises';
import { dirname, basename, resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import createRollup from './utils/create-rollup';
import generateId from './utils/generate-id';
import getPuppeteerBrowserPlatform from './utils/get-puppeteer-browser-platform';

const { option: parseBuildCliArgs } = argv;

const {
  options: buildCliArgs,

  targets: buildCliTargets,
} = parseBuildCliArgs([
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
  'browser-product': puppeteerBrowserProduct = 'chrome',

  'browser-revision': puppeteerBrowserRevision = '1018312',

  'browser-args': puppeteerBrowserArgs = [],

  'browser-ignore-default-args': puppeteerBrowserIgnoreDefaultArgs = [],

  'pkg-target': pkgOutputFileArchitecture = 'host',

  'pkg-entrypoint': pkgAppEntrypointFile = '',
} = buildCliArgs || {};

const [
  url = 'https://localhost:80',

  binaryFilePath = '.',
] = buildCliTargets || [];

const createProjectFileRollup = (input) => createRollup(
  {
    input,

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
);

(async () => {
  let pkgEnvDynamicallyGeneratedCommandString = await createProjectFileRollup(
    resolve(
      // NOTE: this very project "dist" folder path
      __dirname,

      '../src/launch-pkg-env-cli.js',
    ),
  );

  pkgEnvDynamicallyGeneratedCommandString += await createProjectFileRollup(
    resolve(
      // NOTE: this very project "dist" folder path
      __dirname,

      '../src/launch-pkg-env-browser.js',
    ),
  );

  pkgEnvDynamicallyGeneratedCommandString += '(async () => {';

  pkgEnvDynamicallyGeneratedCommandString += `const {
    executablePath: executablePathCli,

    userDataDir: userDataDirCli,
  } = await launchPkgEnvCli(
    "${puppeteerBrowserProduct}",

    "${getPuppeteerBrowserPlatform(pkgOutputFileArchitecture)}",

    "${puppeteerBrowserRevision}",
  );`;

  const instanceId = generateId();

  let dynamicallyGeneratedPkgEntrypointFilePath = resolve(
    // NOTE: this very project "dist" folder path
    __dirname,

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
    // TODO: kill the whole app on browser exit

    await launchPkgEnvBrowser(
      "${url}",

      executablePathCli,

      userDataDirCli,

      "${puppeteerBrowserProduct}",

      ${JSON.stringify(puppeteerBrowserArgs)},

      ${JSON.stringify(puppeteerBrowserIgnoreDefaultArgs)}
    )
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
