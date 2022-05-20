import puppeteer from 'puppeteer';
import getPageTitleExcerpt from './get-page-title-excerpt';
import identifyPages from './identify-pages';
import injectPageResourcesOnce from './inject-page-resources-once';
import log from './log';
import loop from './loop';
import triggerPageClose from './trigger-page-close';

const getBrowserArgs = (product, url, kiosk, width, height) => {
  const base = {
    chrome: [
      `--app=${url}`,

      // NOTE: "new-window" flag proved to be helpful
      // when the given browser executable has open windows/tabs
      // with the given browser profile...
      '--new-window',
    ],

    firefox: [
      url,
    ],
  };

  const args = base[product];

  return args.concat(kiosk ? ['--kiosk'] : [`--window-size=${width},${height}`]);
};

const supportedBrowser = ['firefox', 'chrome'];

const { length: supportedBrowserLength } = supportedBrowser;

const getBrowserType = (executablePath) => {
  for (let i = 0; i < supportedBrowserLength; i += 1) {
    const browser = supportedBrowser[i];

    if (executablePath && executablePath.includes(browser)) {
      return browser;
    }
  }

  return 'unknown';
};

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

  const product = getBrowserType(executablePath);

  const viewport = {
    width,

    height,
  };

  const browser = await puppeteer.launch({
    headless: false,

    product,

    userDataDir,

    executablePath,

    ignoreDefaultArgs: [
      '--enable-automation',

      '--disable-extensions',
    ],

    args: getBrowserArgs(product, url, kiosk, width, height),

    defaultViewport: viewport,
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
        mainPage.setViewport(viewport),
      ];

      const { length: extraPagesCount } = otherPages || [];

      if (extraPagesCount) {
        log('log', `extra pages count: ${extraPagesCount}`);
      }

      const allPages = [mainPage, ...otherPages];

      const injectionTargetPages = focus ? [mainPage] : allPages;

      tasks.concat(injectionTargetPages.map((page) => injectPageResourcesOnce(page, {
        ...options,

        bypassCSP: product === 'chrome', // NOTE: doesn't work in firefox
      })));

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
