import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'path';
import { writeFile } from 'fs/promises';

import transpileScss from './src/js/transpile-scss';
import rollupJs from './src/js/rollup-js';

const buildStyle = async () => writeFile(
  resolve('.', 'dist', 'style.css'),

  await transpileScss(resolve('.', 'src', 'assets', 'style.scss')),
);

const bundleScripts = async () => Promise.all([
  writeFile(
    resolve('.', 'dist', 'scripts.js'),

    await rollupJs({
      input: {
        input: './src/assets/scripts.js',

        plugins: [
          commonjs(),

          nodeResolve(),
        ],
      },

      output: {
        format: 'iife',

        name: 'pkgBrowserGamepadRuntime',
      },
    }),
  ),

  writeFile(
    resolve('.', 'dist', 'launch-browser.cjs'),

    await rollupJs({
      input: {
        input: './src/js/launch-browser.js',

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
  ),

  writeFile(
    resolve('.', 'dist', 'index.cjs'),

    await rollupJs({
      input: {
        input: './src/index.js',

        plugins: [
          commonjs(),
        ],

        external: [
          'argv',

          'globby',

          'pkg',

          'path',

          'fs/promises',
        ],
      },

      output: {
        // exports: 'default',
        name: 'launchBrowser',
        format: 'cjs',
      },
    }),
  ),
]);

buildStyle();

bundleScripts();
