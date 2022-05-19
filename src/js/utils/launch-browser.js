import puppeteer from 'puppeteer';
import getPageTitleExcerpt from './get-page-title-excerpt';
import identifyPages from './identify-pages';
import injectPageResourcesOnce from './inject-page-resources-once';
import log from './log';
import loop from './loop';
import triggerPageClose from './trigger-page-close';

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

      '--disable-extensions',
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

export default launchBrowser;
