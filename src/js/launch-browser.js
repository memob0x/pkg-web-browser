const puppeteer = require('puppeteer');
const hasPageInjectedResources = require('./has-page-injected-resources');
const injectPageResources = require('./inject-page-resources');

const launchBrowser = async (
  url,

  viewportWidth,

  viewportHeight,

  executablePath,

  userDataDir,

  shouldOpenInKiosk,
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

  await page.waitForNavigation({ waitUntil: 'load' });

  // TODO: check, maybe replace polling with a cleaner approach in order to support live reloads
  const pollPageResourcesInjection = async () => {
    try {
      const ok = await hasPageInjectedResources();

      if (!ok) {
        injectPageResources();
      }
    } catch (e) {
      //
    }

    await pollPageResourcesInjection();
  };

  await pollPageResourcesInjection();
};

module.exports = launchBrowser;
