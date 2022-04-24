const puppeteer = require('puppeteer');
const hasPageInjectedResources = require('./has-page-injected-resources');
const injectPageResources = require('./inject-page-resources');
const sleep = require('./sleep');

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

  await page.waitForNavigation({ waitUntil: 'load' });

  // TODO: check, maybe replace polling with a cleaner approach in order to support live reloads
  const pollPageResourcesInjection = async () => {
    try {
      const ok = await hasPageInjectedResources(page);

      if (!ok) {
        await injectPageResources(page, css, js);
      }
    } catch ({ message }) {
      // NOTE: "Execution context was destroyed, most likely because of a navigation."
      // error is raised by page reload...
      if (message.indexOf('Execution context was destroyed') < -1) {
        // ...any other error would cause the browser to close
        await page.close();

        return;
      }
    }

    await pollPageResourcesInjection();

    await sleep(500);
  };

  await pollPageResourcesInjection();
};

module.exports = launchBrowser;
