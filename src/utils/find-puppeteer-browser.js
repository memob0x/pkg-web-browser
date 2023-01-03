import findFile from './find-file';

const isBrowserExecutableFile = (
  { stats, path, name },

  { product, platform, revision },
) => {
  if (stats?.isDirectory()) {
    return false;
  }

  if (revision && !path.includes(revision)) {
    return false;
  }

  let products = product ? [product] : ['chrome', 'firefox'];

  const productsExes = products.map((x) => `${x}.exe`);

  products = platform && platform.startsWith('win') ? productsExes : [...products, ...productsExes];

  return products.includes(name);
};

const findPuppeteerBrowser = async (
  path,

  options,
) => {
  const [foundExecutableFile] = await findFile(
    path,

    (file) => isBrowserExecutableFile(
      file,

      options || {},
    ),
  );

  if (foundExecutableFile) {
    const { path: foundExecutablePath } = foundExecutableFile;

    return foundExecutablePath;
  }

  return '';
};

export default findPuppeteerBrowser;
