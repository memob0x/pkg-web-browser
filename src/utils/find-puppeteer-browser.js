import findFile from './find-file';

const isBrowserExecutableFile = (
  { stats, path, name },

  product,

  platform,

  revision,
) => {
  if (stats.isDirectory()) {
    return false;
  }

  if (!path.includes(revision)) {
    return false;
  }

  if (platform.startsWith('win')) {
    return name === `${product}.exe`;
  }

  return product === name;
};

const findPuppeteerBrowser = async (
  path,

  product,

  platform,

  revision,
) => {
  const [foundExecutableFile] = await findFile(
    path,

    (file) => isBrowserExecutableFile(
      file,

      product,

      platform,

      revision,
    ),
  );

  if (foundExecutableFile) {
    const { path: foundExecutablePath } = foundExecutableFile;

    return foundExecutablePath;
  }

  return '';
};

export default findPuppeteerBrowser;
