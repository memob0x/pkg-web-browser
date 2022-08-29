import puppeteer from 'puppeteer-core';
import { join } from 'path';
import { mkdir } from 'fs/promises';

import awaitSafely from '../utils/await-safely';
import callAndAwaitWithRetry from '../utils/async-call-with-retry';
import getStringExcerpt from '../utils/get-string-excerpt';
import disallowNewPages from '../browser/disallow-new-pages';
import awaitWithTimeout from '../utils/await-with-timeout';
import getBrowserExecutablePath from './get-browser-executable-path';
import log from './log';
import getBrowserPlatform from './get-browser-platform';

const STRING_INJECTED_FLAG_NAME = 'pkgWebsite';

const executeBrowserProcessLoopIteration = async (browser, mainPage, options) => {
  if (!browser || !mainPage) {
    await log('error', 'no browser or page found, nothing to do');

    // break
    return;
  }

  const { focus, styles, scripts } = options || {};

  try {
    await log('log', 'polling iteration started');

    const pages = await awaitSafely(
      callAndAwaitWithRetry(
        awaitWithTimeout.bind(
          null,

          browser.pages(),

          1500,
        ),

        2,
      ),

      [],
    );

    const pagesCount = pages.length;

    if (!pagesCount) {
      log('log', 'no pages found, abort');

      return;
    }

    await log('log', () => `retrieved ${pagesCount} pages`);

    const otherPages = await pages.reduce(async (prev, curr) => {
      if (curr === mainPage) {
        return prev;
      }

      const currTitle = await awaitSafely(curr.title(), '');

      if (currTitle.includes('DevTools')) {
        return prev;
      }

      return (await prev).concat(curr);
    }, Promise.resolve([]));

    const extraPagesCount = otherPages.length;

    await log('log', `extra pages count: ${extraPagesCount}`);

    const injectionTargetPages = focus ? [mainPage] : pages;

    let tasks = [];

    tasks = tasks.concat(
      injectionTargetPages.map(async (page) => {
        const titleTrimmed = getStringExcerpt(await awaitSafely(page.title(), ''), 10);

        const areResourcesInjected = await awaitSafely(page.evaluate(`window.${STRING_INJECTED_FLAG_NAME}`), '');

        await log('log', `are resources injected for page "${titleTrimmed}": ${!!areResourcesInjected}`);

        if (areResourcesInjected) {
          return;
        }

        await awaitSafely(page.evaluate(`window.${STRING_INJECTED_FLAG_NAME} = {};`));

        await log('log', () => `injecting resources to page "${titleTrimmed}" ("${getStringExcerpt(styles, 10)}" "${getStringExcerpt(scripts, 10)}")`);

        await awaitSafely(awaitWithTimeout(
          Promise.all([
            page.addStyleTag({ content: styles }),

            page.addScriptTag({ content: scripts }),
          ]),

          6000,
        ));

        await log('log', `resources to page "${titleTrimmed}" injected`);
      }),
    );

    if (focus) {
      await log('log', 'focus mode, the program will try its best to tackle all new pages opening');

      tasks = tasks.concat(
        injectionTargetPages.map((page) => awaitSafely(awaitWithTimeout(
          page.evaluate(`(${disallowNewPages.toString()})()`),

          6000,
        ))),
      );
    }

    if (focus && extraPagesCount) {
      await log('log', async () => `focus mode: page "${getStringExcerpt(await awaitSafely(mainPage.title(), ''))}" taken to front`);

      tasks.push(
        awaitSafely(awaitWithTimeout(mainPage.bringToFront())),
      );

      tasks = tasks.concat(
        otherPages.map((page) => awaitSafely(awaitWithTimeout(page.close()))),
      );
    }

    await Promise.all(tasks);

    await log('log', 'polling iteration ended');

    // continue
    await executeBrowserProcessLoopIteration(browser, mainPage, options);
  } catch ({ message, stack }) {
    await log('log', `handled error (${message} ${stack})`);

    if (
      // browser is still going
      browser.isConnected()
    ) {
      await log('log', 'restarting loop');

      // continue
      await executeBrowserProcessLoopIteration(browser, mainPage, options);

      return;
    }

    await log('log', 'not restarting loop');

    // break
  }
};

const launchBrowser = async (options) => {
  const {
    defaultViewport,

    userDataDir,

    product,

    ignoreDefaultArgs,

    args,

    url,

    executablePath,

    downloadHost,

    downloadPath,

    binaryFileArch,

    revision,
  } = options || {};

  await log('log', `args: ${args}`);

  await log('log', `ignored args: ${ignoreDefaultArgs}`);

  await log('log', 'launching browser');

  if (userDataDir) {
    await awaitSafely(mkdir(userDataDir));
  }

  const browser = await awaitWithTimeout(
    puppeteer.launch({
      headless: false,

      waitForInitialPage: false,

      product,

      userDataDir,

      executablePath: await getBrowserExecutablePath(
        executablePath,

        downloadPath || join(process.cwd(), '.pkg-web-browser'),

        downloadHost,

        getBrowserPlatform(binaryFileArch),

        product,

        revision,
      ),

      ignoreDefaultArgs,

      args,

      defaultViewport,
    }),

    12000,
  );

  await log('log', 'browser launched');

  await log('log', 'launching main page');

  const mainPage = await awaitWithTimeout(
    browser.newPage(),

    12000,
  );

  await log('log', 'main page launched');

  await log('log', `navigating ${url}`);

  await awaitWithTimeout(
    mainPage.goto(url),

    6000,
  );

  await log('log', `${url} navigated`);

  await log('log', 'main loop start');

  await executeBrowserProcessLoopIteration(browser, mainPage, options);

  await log('log', 'main loop ended');

  await awaitWithTimeout(
    browser.close(),

    4000,
  );

  await log('log', 'ok, bye');
};

// eslint-disable-next-line import/no-unused-modules
export default launchBrowser;
