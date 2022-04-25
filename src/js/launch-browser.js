const puppeteer = require('puppeteer');
const hasPageInjectedResources = require('./has-page-injected-resources');
const injectPageResources = require('./inject-page-resources');
const setPageInjectionFlag = require('./set-page-injection-flag');
const sleep = require('./sleep');

const handleError = async (page, message) => {
  if (message.includes('Failed to add page binding with name')) {
    return true;
  }

  if (message.includes('Execution context was destroyed')) {
    await setPageInjectionFlag(page, false);

    return true;
  }

  // eslint-disable-next-line no-console
  console.error(message);

  await page.close();

  return false;
};

const launchBrowser = async (
  url,

  viewportWidth,

  viewportHeight,

  executablePath,

  userDataDir,

  shouldOpenInKiosk,

  css,

  js,
) => {
  const args = [
    `--app=${url}`,

    '--new-window',
  ];

  if (shouldOpenInKiosk) {
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

  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  const pollPageResourcesInjection = async () => {
    try {
      const injected = await hasPageInjectedResources(page);

      if (!injected) {
        await injectPageResources(page, css, js);
      }
    } catch ({ message }) {
      const shouldContinue = await handleError(page, message);

      if (!shouldContinue) {
        return;
      }
    }

    await sleep(2000);

    await pollPageResourcesInjection();
  };

  await pollPageResourcesInjection();
};

module.exports = launchBrowser;
