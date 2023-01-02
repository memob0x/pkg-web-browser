import findFile from './find-file';

const browserExecutableFileNames = [
  'chrome',

  'chrome.exe',

  'firefox',

  'firefox.exe',
];

const isBrowserExecutableFile = ({ stats, name }) => {
  if (stats.isDirectory()) {
    return false;
  }

  return browserExecutableFileNames.includes(name);
};

const findPuppeteerBrowser = async (path) => {
  const [foundExecutableFile] = await findFile(path, isBrowserExecutableFile);

  if (foundExecutableFile) {
    const { path: foundExecutablePath } = foundExecutableFile;

    return foundExecutablePath;
  }

  return '';
};

export default findPuppeteerBrowser;
