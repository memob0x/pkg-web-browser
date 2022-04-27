const puppeteer = require('puppeteer');

const pollOtherPagesClose = require('./poll-other-pages-close');
const pollPageResourcesInjection = require('./poll-page-resources-injection');
const sleep = require('./sleep');

const launchBrowser = async (
  url,

  viewportWidth,

  viewportHeight,

  executablePath,

  userDataDir,

  mode,

  css,

  js,
) => {
  const args = [
    `--app=${url}`,

    '--new-window',
  ];

  if (mode === 'kiosk') {
    args.push('--kiosk');
  }

  const browser = await puppeteer.launch({
    headless: false,

    userDataDir,

    executablePath,

    ignoreDefaultArgs: [
      '--enable-automation',
    ],

    args,
  });

  const [page] = await browser.pages();

  await page.setViewport({
    width: viewportWidth,

    height: viewportHeight,
  });

  await sleep(4000);

  await Promise.all([
    pollPageResourcesInjection(
      page,

      viewportWidth,

      viewportHeight,

      css,

      js,
    ),

    pollOtherPagesClose(browser, page),
  ]);
};

module.exports = launchBrowser;
