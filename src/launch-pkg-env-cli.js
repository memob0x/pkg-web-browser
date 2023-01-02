/* eslint-disable no-console */
import puppeteer, { BrowserFetcher } from 'puppeteer-core';
import findPuppeteerBrowser from './utils/find-puppeteer-browser';

const STRING_DEFAULT_BROWSER_EXECUTABLE_PATH = '.local-browser';

const STRING_DEFAULT_BROWSER_DATA_DIRECTORY = '.local-browser-user';

const launchPkgEnvCli = async (
  url,

  options,
) => {
  console.log('locating browser...');

  // TODO: allow browser + user dir choose + these preferences should be saved in a file

  let finalExecutablePath = await findPuppeteerBrowser(STRING_DEFAULT_BROWSER_EXECUTABLE_PATH);

  if (finalExecutablePath) {
    console.log(`found existent browser "${finalExecutablePath}"`);
  }

  const {
    platform,

    product,

    revision,

    args,

    ignoreDefaultArgs,
  } = options || {};

  if (!finalExecutablePath) {
    console.log(`downloading browser to "${STRING_DEFAULT_BROWSER_EXECUTABLE_PATH}"...`);

    const browserFetcher = new BrowserFetcher({
      path: STRING_DEFAULT_BROWSER_EXECUTABLE_PATH,

      platform,

      product,
    });

    ({ finalExecutablePath } = await browserFetcher.download(revision));

    console.log(`browser downloaded "${finalExecutablePath}"`);
  }

  console.log(`navigating "${url}"`);

  const browser = await puppeteer.launch({
    headless: false,

    // NOTE: otherwise chrome renders the page in a fixed w/h "frame" somehow...
    defaultViewport: null,

    executablePath: finalExecutablePath,

    userDataDir: STRING_DEFAULT_BROWSER_DATA_DIRECTORY,

    product,

    args,

    ignoreDefaultArgs,
  });

  let [mainPage] = await browser.pages();

  mainPage = mainPage || await browser.newPage();

  await mainPage.goto(url);

  console.log(`"${url}" navigated`);

  // TODO: kill the whole app on browser exit
};

// eslint-disable-next-line import/no-unused-modules
export default launchPkgEnvCli;
