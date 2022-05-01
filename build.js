const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const { resolve } = require('path');
const { writeFile } = require('fs/promises');

const { rollup } = require('rollup');
const transpileScss = require('./src/js/transpile-scss');

const buildStyle = async () => writeFile(
  resolve(__dirname, 'dist', 'style.css'),

  await transpileScss(resolve(__dirname, 'src', 'assets', 'style.scss')),
);

const bundleScripts = async () => {
  const input = await rollup({
    input: './src/assets/scripts.js',

    plugins: [
      commonjs(),

      nodeResolve(),
    ],
  });

  const { output } = await input.generate({
    format: 'iife',

    name: 'pkgBrowserGamepadRuntime',
  });

  await writeFile(
    resolve(__dirname, 'dist', 'scripts.js'),

    output[0].code,
  );
};

buildStyle();

bundleScripts();
