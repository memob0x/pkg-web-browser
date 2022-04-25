const puppeteer = require('puppeteer');
const hasPageInjectedResources = require('./has-page-injected-resources');
const injectPageResources = require('./inject-page-resources');
const log = require('./log');
const sleep = require('./sleep');

const getPageErrorReport = async (page, message) => {
  if (message.includes('Execution context was destroyed')) {
    log('log', 'page reload');

    return { shouldExit: false, shouldRepeatInjection: true };
  }

  log('error', message);

  return { shouldExit: true };
};

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

  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  await sleep(4000);

  let isInjectedForPolling = false;

  const pollPageResourcesInjection = async () => {
    try {
      log('log', 'for polling, resources are injected:', isInjectedForPolling, 'resources are actually injected:', await hasPageInjectedResources(page));

      if (!isInjectedForPolling || !await hasPageInjectedResources(page)) {
        log('log', 'injecting');

        isInjectedForPolling = true;

        await injectPageResources(page, css, js);

        log('log', 'injected');
      }
    } catch ({ message }) {
      const {
        shouldExit,

        shouldRepeatInjection,
      } = await getPageErrorReport(page, message);

      if (shouldExit) {
        await page.close();

        return;
      }

      if (shouldRepeatInjection) {
        isInjectedForPolling = false;
      }
    }

    await sleep(2000);

    await pollPageResourcesInjection();
  };

  await pollPageResourcesInjection();
};

module.exports = launchBrowser;
