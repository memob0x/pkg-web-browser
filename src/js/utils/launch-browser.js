import puppeteer from 'puppeteer';
import bringPageToFront from './bring-page-to-front';
import identifyPages from './identify-pages';
import injectPageAntiPopupPolicy from './inject-page-anti-popup-policy';
import injectPageResourcesOnce from './inject-page-resources-once';
import log from './log';
import loop from './loop';
import triggerPageClose from './trigger-page-close';

const launchBrowser = async (options) => {
  const {
    width,

    height,

    executablePath,

    userDataDir,

    focus,

    loopIntervalTime,

    product,

    ignoreDefaultArgs,

    args,
  } = options || {};

  const defaultViewport = {
    width,

    height,
  };

  const browser = await puppeteer.launch({
    headless: false,

    product,

    userDataDir,

    executablePath,

    ignoreDefaultArgs,

    args,

    defaultViewport,
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
        mainPage.setViewport(defaultViewport),
      ];

      const { length: extraPagesCount } = otherPages || [];

      if (extraPagesCount) {
        log('log', `extra pages count: ${extraPagesCount}`);
      }

      const allPages = [mainPage, ...otherPages];

      const injectionTargetPages = focus ? [mainPage] : allPages;

      tasks = tasks.concat(
        injectionTargetPages.map((page) => injectPageResourcesOnce(page, options)),
      );

      if (focus) {
        log('log', 'focus mode');

        tasks = tasks.concat(
          injectionTargetPages.map(injectPageAntiPopupPolicy),
        );
      }

      if (focus && extraPagesCount) {
        tasks.push(
          bringPageToFront(mainPage),
        );

        tasks = tasks.concat(
          otherPages.map(triggerPageClose),
        );
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

      if (message.includes('Protocol error')) {
        log('log', 'history navigation'); // TODO: check

        // continue
        return true;
      }

      log('error', `unhandled error "${message}", aborting`);

      // break
      return false;
    },
  );
};

// eslint-disable-next-line import/no-unused-modules
export default launchBrowser;
