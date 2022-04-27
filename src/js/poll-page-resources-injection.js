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

const pollPageResourcesInjection = async (page, viewportWidth, viewportHeight, css, js) => {
  let isInjectedForPolling = false;

  const closure = async () => {
    try {
      log('log', 'for polling, resources are injected:', isInjectedForPolling, 'resources are actually injected:', await hasPageInjectedResources(page));

      if (!isInjectedForPolling || !await hasPageInjectedResources(page)) {
        log('log', 'injecting');

        isInjectedForPolling = true;

        await injectPageResources(
          page,

          viewportWidth,

          viewportHeight,

          css,

          js,
        );

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

    await closure();
  };

  await closure();
};

module.exports = pollPageResourcesInjection;
