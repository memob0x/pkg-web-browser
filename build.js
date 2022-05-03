import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'path';
import { writeFile, mkdir } from 'fs/promises';

import transpileScss from './src/js/transpile-scss';
import rollupJs from './src/js/rollup-js';

const srcPath = resolve('.', 'src');
const distPath = resolve('.', 'dist');

const buildStyle = async () => writeFile(
  resolve(distPath, 'style.css'),

  await transpileScss(resolve(srcPath, 'assets', 'style.scss')),
);

const bundleScripts = async () => Promise.all([
  writeFile(
    resolve(distPath, 'scripts.js'),

    await rollupJs({
      input: {
        input: resolve(srcPath, 'assets', 'scripts.js'),

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
    resolve(distPath, 'launch-browser.cjs'),

    await rollupJs({
      input: {
        input: resolve(srcPath, 'js', 'launch-browser.js'),

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
    resolve(distPath, 'index.cjs'),

    await rollupJs({
      input: {
        input: resolve(srcPath, 'index.js'),

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

try {
  await mkdir(distPath);
} catch (e) {
  //
}

buildStyle();

bundleScripts();
