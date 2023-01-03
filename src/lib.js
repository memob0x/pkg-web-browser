/* eslint-disable import/no-unused-modules */
/* eslint-disable no-console */
import puppeteer, { BrowserFetcher } from 'puppeteer-core';
import { stat } from 'fs/promises';
import findPuppeteerBrowser from './utils/find-puppeteer-browser';

import { STRING_PUPPETEER_BROWSER_DEFAULT_EXECUTABLE_PATH, STRING_PUPPETEER_BROWSER_DEFAULT_USER_DATA_DIR_PATH } from './constants';

export * from './constants';

const getBrowserInfosString = (product, platform, revision) => `(${
  product || 'unknown'
}${
  platform ? `, ${platform}` : ''
}${
  revision ? `, ${revision}` : ''
})`;

export const getPuppeteerBrowserExecutablePath = async (
  product,

  platform,

  revision,

  executablePathCandidate,
) => {
  const executablePathCandidateClean = executablePathCandidate
    || STRING_PUPPETEER_BROWSER_DEFAULT_EXECUTABLE_PATH;

  const browserInfos = getBrowserInfosString(product, platform, revision);

  console.log(`Looking for browser ${browserInfos} inside of "${executablePathCandidateClean}"`);

  const findPuppeteerBrowserOptions = executablePathCandidate ? null : {
    product,

    platform,

    revision,
  };

  let executablePath = await findPuppeteerBrowser(
    executablePathCandidateClean,

    findPuppeteerBrowserOptions,
  );

  if (executablePath) {
    console.log(`Using browser ${browserInfos} "${executablePath}"`);
  }

  if (!executablePath && executablePathCandidateClean) {
    console.warn(`No browser ${browserInfos} has been found at "${executablePathCandidateClean}"`);
  }

  if (!executablePath) {
    executablePath = STRING_PUPPETEER_BROWSER_DEFAULT_EXECUTABLE_PATH;

    console.log(`Downloading browser ${browserInfos} to "${executablePath}"`);

    ({ executablePath } = await new BrowserFetcher({
      path: executablePath,

      platform,

      product,
    }).download(revision));

    console.log(`Browser ${browserInfos} downloaded "${executablePath}"`);
  }

  return executablePath;
};

const getBrowserPage = async (browser) => {
  const [mainPage] = await browser.pages();

  return mainPage || browser.newPage();
};

export const launchPuppeteerBrowser = async (
  url,

  executablePath,

  userDataDirCandidate,

  product,

  args,

  ignoreDefaultArgs,
) => {
  const userDataDirCandidateClean = userDataDirCandidate
    || STRING_PUPPETEER_BROWSER_DEFAULT_USER_DATA_DIR_PATH;

  if (userDataDirCandidateClean) {
    console.log(`Trying to use user-data dir "${userDataDirCandidateClean}"`);
  }

  const userDataDirStats = await stat(userDataDirCandidateClean);

  const userDataDirExists = userDataDirStats?.isDirectory();

  let userDataDirClean = '';

  if (userDataDirExists) {
    userDataDirClean = userDataDirCandidateClean;

    console.log(`Using existent user-data dir "${userDataDirClean}"`);
  }

  if (!userDataDirExists) {
    userDataDirClean = STRING_PUPPETEER_BROWSER_DEFAULT_USER_DATA_DIR_PATH;

    console.warn(`User-data dir "${userDataDirCandidateClean}" doesn't exists, creating "${userDataDirClean}"`);
  }

  const browserInfos = getBrowserInfosString(product);

  console.log(`Launching browser ${browserInfos} "${executablePath}"`);

  const browser = await puppeteer.launch({
    headless: false,

    // NOTE: otherwise chrome renders the page in a fixed w/h "frame" somehow...
    defaultViewport: null,

    executablePath,

    userDataDir: userDataDirClean,

    product,

    args,

    ignoreDefaultArgs,
  });

  console.log(`Browser ${browserInfos} "${executablePath}" launched.`);

  console.log(`Retrieving ${browserInfos} "${executablePath}" best page.`);

  const page = await getBrowserPage(browser);

  console.log(`Browser ${browserInfos} "${executablePath}" best page retrieved.`);

  try {
    console.log(`Navigating "${url}" on browser ${browserInfos} "${executablePath}"`);

    await page.goto(url);

    console.log(`Navigation "${url}" complete for browser ${browserInfos} "${executablePath}"`);
  } catch (e) {
    console.error(e);
  }

  return browser;
};
