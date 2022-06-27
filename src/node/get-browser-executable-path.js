import { stat } from 'fs/promises';
import awaitSafely from '../utils/await-safely';
import downloadBrowser from './download-browser';

const getBrowserExecutablePath = async (
  executablePath,

  downloadPath,

  host,

  platform,

  product,

  revision,
) => {
  if (await awaitSafely(stat(executablePath))) {
    return executablePath;
  }

  return downloadBrowser(
    downloadPath,

    host,

    platform,

    product,

    revision,
  );
};

export default getBrowserExecutablePath;
