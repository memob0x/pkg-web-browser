import { resolve } from 'path';
import { mkdir } from 'fs/promises';
import createLibraryBundleFile from './src/node/create-library-bundle-file';
import awaitSafely from './src/utils/await-safely';

const outputPath = resolve('./dist');

await awaitSafely(mkdir(outputPath));

await createLibraryBundleFile(
  resolve('./src/index.js'),

  `${outputPath}/index.cjs`,
);
