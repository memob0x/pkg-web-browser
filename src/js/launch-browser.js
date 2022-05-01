const puppeteer = require('puppeteer');
const getPageTitleExcerpt = require('./get-page-title-excerpt');
const identifyPages = require('./identify-pages');
const injectPageResourcesOnce = require('./inject-page-resources-once');
const log = require('./log');
const loop = require('./loop');
const triggerPageClose = require('./trigger-page-close');

const launchBrowser = async (url, options) => {
  const {
    width,

    height,

    executablePath,

    userDataDir,

    kiosk,

    focus,

    loopIntervalTime,
  } = options || {};

  const args = [
    `--app=${url}`,

    // NOTE: "new-window" flag proved to be helpful
    // when the given browser executable has open windows/tabs
    // with the given browser profile...
    '--new-window',
  ];

  if (kiosk) {
    args.push('--kiosk');
  }

  if (!kiosk) {
    args.push(`--window-size=${width},${height}`);
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

  return loop(
    async () => {
      const {
        main: mainPage,

        other: otherPages,
      } = await identifyPages(browser);

      if (!mainPage) {
        log('error', 'no page found');

        // break
        return false;
      }

      let tasks = [
        mainPage.setViewport({
          width,

          height,
        }),
      ];

      const { length: extraPagesCount } = otherPages || [];

      if (extraPagesCount) {
        log('log', `extra pages count: ${extraPagesCount}`);
      }

      const allPages = [mainPage, ...otherPages];

      const injectionTargetPages = focus ? [mainPage] : allPages;

      tasks.concat(injectionTargetPages.map((page) => injectPageResourcesOnce(page, options)));

      if (focus && extraPagesCount) {
        log('log', `focus mode: page "${await getPageTitleExcerpt(mainPage)}" taken to front`);

        tasks.push(mainPage.bringToFront());

        tasks = tasks.concat(otherPages.map(triggerPageClose));
      }

      await Promise.all(tasks);

      // continue
      return true;
    },

    loopIntervalTime,

    ({ message }) => {
      if (message.includes('Execution context was destroyed')) {
        log('log', 'page reload');

        // continue
        return true;
      }

      log('error', `unhandled error "${message}", aborting`);

      // break
      return false;
    },
  );
};

module.exports = launchBrowser;
