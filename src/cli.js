/* eslint-disable import/no-unused-modules */
/* eslint-disable no-console */
import puppeteer, { BrowserFetcher } from 'puppeteer-core';
import findPuppeteerBrowser from './utils/find-puppeteer-browser';

const STRING_DEFAULT_BROWSER_EXECUTABLE_PATH = '.pkg-web-browser';

const STRING_DEFAULT_BROWSER_DATA_DIRECTORY = '.pkg-web-browser-user';

/*
const readlineAsk = (readlineInterface, question) => new Promise((resolve) => {
  if (!readlineInterface) {
    resolve('');

    return;
  }

  readlineInterface.question(question, resolve);
});

const readlineAskConsense = async (rl, q) => {
  let reply = await readlineAsk(rl, q);

  reply = reply.trim().toLocaleLowerCase();

  return reply === 'yes' || reply === 'y';
}; */

export const launchUserPreferencesCli = async (
  readlineInterface,

  product,

  platform,

  revision,
) => {
  const infos = [
    product,

    platform,

    revision,
  ].join(', ');

  const executablePathCandidate = STRING_DEFAULT_BROWSER_EXECUTABLE_PATH;

  /* const specifyExecutablePathReply = await readlineAskConsense(
    readlineInterface,

    `Would you like to specify a path to a previously installed browser (${infos})?`,
  );

  if (specifyExecutablePathReply) {
    executablePath = await readlineAskConsense(
      readlineInterface,

      `Specify the to browser (${infos}) executable file:`,
    );
  } */

  let executablePath = await findPuppeteerBrowser(
    executablePathCandidate,

    product,

    platform,

    revision,
  );

  if (executablePath) {
    console.log(`Browser (${infos}) in use: "${executablePath}"`);
  }

  if (!executablePath && executablePathCandidate) {
    console.log(`No browser (${infos}) has been found at "${executablePathCandidate}"`);
  }

  if (!executablePath) {
    console.log(`Downloading browser (${infos}) to "${STRING_DEFAULT_BROWSER_EXECUTABLE_PATH}"...`);

    ({ executablePath } = await new BrowserFetcher({
      path: STRING_DEFAULT_BROWSER_EXECUTABLE_PATH,

      platform,

      product,
    }).download(revision));

    console.log(`Browser (${infos}) downloaded "${executablePath}"`);
  }

  return {
    executablePath,

    userDataDir: STRING_DEFAULT_BROWSER_DATA_DIRECTORY,
  };
};

export const launchBrowser = async (
  url,

  executablePath,

  userDataDir,

  product,

  args,

  ignoreDefaultArgs,
) => {
  const browser = await puppeteer.launch({
    headless: false,

    // NOTE: otherwise chrome renders the page in a fixed w/h "frame" somehow...
    defaultViewport: null,

    executablePath,

    userDataDir,

    product,

    args,

    ignoreDefaultArgs,
  });

  let [mainPage] = await browser.pages();

  mainPage = mainPage || await browser.newPage();

  try {
    console.log(`navigating "${url}"`);

    await mainPage.goto(url);

    console.log(`"${url}" navigated`);
  } catch (e) {
    console.error(e);
  }

  return browser;
};
