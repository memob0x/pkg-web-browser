const puppeteer = require('puppeteer');
const getPageTitleExcerpt = require('./get-page-title-excerpt');
const hasPageInjectedResources = require('./has-page-injected-resources');
const identifyPages = require('./identify-pages');
const injectPageResources = require('./inject-page-resources');
const log = require('./log');
const loop = require('./loop');
const setPageInjectionFlag = require('./set-page-injection-flag');

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
      const [mainPage, otherPages] = await identifyPages(browser);

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

      tasks.concat(injectionTargetPages.map(async (page) => {
        const isInjected = await hasPageInjectedResources(page);

        log('log', `page "${await getPageTitleExcerpt(page)}" injection:`, isInjected);

        if (!isInjected) {
          await setPageInjectionFlag(page, true);

          log('log', 'injecting');

          await injectPageResources(page, options);

          log('log', 'injected');
        }
      }));

      if (focus && extraPagesCount) {
        log('log', `focus mode: page "${await getPageTitleExcerpt(mainPage)}" taken to front`);

        tasks.push(mainPage.bringToFront());

        tasks = tasks.concat(otherPages.map(async (page) => {
          log('log', `focus mode: page "${await getPageTitleExcerpt(page)}" closed`);

          return page.close();
        }));
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
