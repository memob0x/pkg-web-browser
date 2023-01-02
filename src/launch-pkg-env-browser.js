/* eslint-disable no-console */
import puppeteer from 'puppeteer-core';

const launchPkgEnvBrowser = async (
  url,

  executablePath,

  userDataDir,

  product,

  args,

  ignoreDefaultArgs,
) => {
  console.log(`navigating "${url}"`);

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
    await mainPage.goto(url);

    console.log(`"${url}" navigated`);
  } catch (e) {
    console.error(e);
  }
};

// eslint-disable-next-line import/no-unused-modules
export default launchPkgEnvBrowser;
