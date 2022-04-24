const { resolve } = require('path');
const { writeFile } = require('fs/promises');

const { minify } = require('terser');

const transpileScss = require('./src/js/transpile-scss');
const transpileCjs = require('./src/js/transpile-cjs');

const bundle = (values) => values.reduce((previous, current) => previous + current, '');

const minifyCode = async (input) => {
  const { code } = await minify(input);

  return code;
};

const bundleCss = async () => {
  const transpilations = await Promise.all([
    transpileScss(resolve(__dirname, 'src', 'scss', 'gamepad-pointer.scss')),
  ]);

  await writeFile(resolve(__dirname, 'dist', 'style.css'), bundle(transpilations));
};

const bundleJs = async () => {
  const transpilations = await Promise.all([
    transpileCjs(resolve(__dirname, 'src', 'js', 'create-gamepad-support.js')),

    transpileCjs(resolve(__dirname, 'src', 'js', 'create-gamepad-pointer.js')),

    transpileCjs(resolve(__dirname, 'src', 'js', 'create-gamepad-scroller.js')),
  ]);

  await writeFile(resolve(__dirname, 'dist', 'scripts.js'), await minifyCode(`${bundle(transpilations)}
    createGamepadSupport(window);

    createGamepadPointer(window);
    
    createGamepadScroller(window);
  `));
};

bundleCss();

bundleJs();
