/* eslint-disable no-console */
import { BrowserFetcher } from 'puppeteer-core';
import findPuppeteerBrowser from './utils/find-puppeteer-browser';

const STRING_DEFAULT_BROWSER_EXECUTABLE_PATH = '.local-browser';

const STRING_DEFAULT_BROWSER_DATA_DIRECTORY = '.local-browser-user';

const launchPkgEnvCli = async (
  product,

  platform,

  revision,
) => {
  console.log('locating browser...');

  // TODO: allow browser + user dir choose + these preferences should be saved in a file

  let executablePath = await findPuppeteerBrowser(STRING_DEFAULT_BROWSER_EXECUTABLE_PATH);

  if (executablePath) {
    console.log(`found existent browser "${executablePath}"`);
  }

  if (!executablePath) {
    console.log(`downloading browser to "${STRING_DEFAULT_BROWSER_EXECUTABLE_PATH}"...`);

    (executablePath = await new BrowserFetcher({
      path: STRING_DEFAULT_BROWSER_EXECUTABLE_PATH,

      platform,

      product,
    }).download(revision));

    console.log(`browser downloaded "${executablePath}"`);
  }

  return {
    executablePath,

    userDataDir: STRING_DEFAULT_BROWSER_DATA_DIRECTORY,
  };
};

// eslint-disable-next-line import/no-unused-modules
export default launchPkgEnvCli;
