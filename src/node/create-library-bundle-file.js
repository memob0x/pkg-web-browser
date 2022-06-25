import commonjs from '@rollup/plugin-commonjs';
import { writeFile } from 'fs/promises';
import createJsBundleFile from './create-js-bundle-file';

const createLibraryBundleFile = async (inputPath, outputPath) => writeFile(
  outputPath,

  await createJsBundleFile(
    {
      input: inputPath,

      plugins: [
        commonjs(),
      ],

      external: [
        'fs/promises',

        'path',

        'argv',

        'pkg',

        'rollup',

        '@rollup/plugin-commonjs',

        '@rollup/plugin-node-resolve',
      ],
    },

    {
      format: 'cjs',
    },
  ),
);

export default createLibraryBundleFile;
