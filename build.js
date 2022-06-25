import { resolve } from 'path';
import { mkdir } from 'fs/promises';
import createLibraryBundleFile from './src/node/create-library-bundle-file';

const outputPath = resolve('./dist');

try {
  await mkdir(outputPath);
} catch (e) {
  //
}

await createLibraryBundleFile(
  resolve('./src/index.js'),

  `${outputPath}/index.cjs`,
);
