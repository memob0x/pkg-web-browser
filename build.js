import { resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import commonjs from '@rollup/plugin-commonjs';
import createRollup from './src/utils/create-rollup';

const outputPath = resolve('./dist');

try {
  await mkdir(outputPath);
} catch (error) {
  if (error.code !== 'EEXIST') {
    throw error;
  }
}

await writeFile(
  `${outputPath}/index.cjs`,

  await createRollup(
    {
      input: resolve('./src/index.js'),

      plugins: [
        commonjs(),
      ],

      external: [
        'puppeteer-core',

        'fs/promises',

        'path',

        'argv',

        'pkg',

        'rollup',

        '@rollup/plugin-commonjs',
      ],
    },

    {
      format: 'cjs',
    },
  ),
);
