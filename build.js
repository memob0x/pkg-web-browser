import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import rollupJs from './src/js/utils/rollup-js';

import {
  PATH_SRC,

  PATH_DIST,
} from './paths';

try {
  await mkdir(PATH_DIST);
} catch (e) {
  //
}

writeFile(
  resolve(PATH_DIST, 'make.cjs'),

  await rollupJs({
    input: {
      input: resolve(PATH_SRC, 'js', 'make.js'),

      plugins: [
        commonjs(),
      ],

      external: [
        'argv',

        'globby',

        'pkg',

        'path',

        'node-sass',

        'rollup',

        '@rollup/plugin-commonjs',

        '@rollup/plugin-node-resolve',

        'fs/promises',
      ],
    },

    output: {
      format: 'cjs',
    },
  }),
);
