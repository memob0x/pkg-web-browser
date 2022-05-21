import puppeteer from 'puppeteer';
import bringPageToFront from './bring-page-to-front';
import executeFunctionWithRetry from './execute-function-with-retry';
import getPageTitle from './get-page-title';
import getPagesOrDefault from './get-pages-or-default';
import injectPageAntiPopupPolicy from './inject-page-anti-popup-policy';
import injectPageResourcesOnce from './inject-page-resources-once';
import log from './log';
import triggerPageClose from './trigger-page-close';

const executeBrowserProcessLoopIteration = async (browser, mainPage, options) => {
  if (!browser || !mainPage) {
    log('error', 'no browser or page foun, nothing to do');

    // break
    return;
  }

  const { focus } = options || {};

  try {
    log('log', 'polling iteration started');

    const pages = await getPagesOrDefault(browser);

    log('log', 'retrieved pages');

    const otherPages = await pages.reduce(async (prev, curr) => {
      if (curr === mainPage) {
        return prev;
      }

      const currTitle = await getPageTitle(curr);

      if (currTitle.includes('DevTools')) {
        return prev;
      }

      return (await prev).concat(curr);
    }, Promise.resolve([]));

    const { length: extraPagesCount } = otherPages || [];

    if (extraPagesCount > 0) {
      log('log', `extra pages count: ${extraPagesCount}`);
    }

    const injectionTargetPages = focus ? [mainPage] : pages;

    let tasks = [];

    tasks = tasks.concat(
      injectionTargetPages.map((page) => injectPageResourcesOnce(page, options)),
    );

    if (focus) {
      log('log', 'focus mode, will try my best to tackle all popups and windows opening');

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

    log('log', 'polling iteration ended');

    // continue
    await executeBrowserProcessLoopIteration(browser, mainPage, options);
  } catch ({ message }) {
    log('log', `handled error (${message})`);

    if (
      // browser is still going
      browser.isConnected()
    ) {
      log('log', 'restarting loop');

      // continue
      await executeBrowserProcessLoopIteration(browser, mainPage, options);

      return;
    }

    log('log', 'not restarting loop');

    // break
  }
};

const launchBrowser = async (options) => {
  const {
    defaultViewport,

    executablePath,

    userDataDir,

    product,

    ignoreDefaultArgs,

    args,

    url,
  } = options || {};

  log('log', 'launching browser');

  let browser = null;

  try {
    browser = await executeFunctionWithRetry(() => puppeteer.launch({
      headless: false,

      product,

      userDataDir,

      executablePath,

      ignoreDefaultArgs,

      args,

      defaultViewport,
    }), 1);
  } catch (e) {
    log('error', `browser failed to launch, nothing to do about it (Error: ${e.message}).`);

    return;
  }

  log('log', 'browser launched');

  log('log', 'launching main page');

  const mainPage = await browser.newPage();

  log('log', 'main page launched');

  log('log', `navigating ${url}`);

  await mainPage.goto(url);

  log('log', `${url} navigated`);

  log('log', 'main loop start');

  await executeBrowserProcessLoopIteration(browser, mainPage, options);

  log('log', 'main loop ended');

  browser.close();

  log('log', 'ok, bye');
};

// eslint-disable-next-line import/no-unused-modules
export default launchBrowser;
