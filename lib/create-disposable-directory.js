import { mkdir, rm } from 'node:fs/promises';

export default async function createDisposableDirectory(dist) {
  await mkdir(dist, {
    recursive: true,
  });

  return () => rm(dist, {
    recursive: true,
  });
}
