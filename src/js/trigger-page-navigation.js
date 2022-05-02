const log = require('./log');

const reload = async (page) => {
  try {
    log('log', 'reload: start');

    const value = await page.reload();

    log('log', 'reload: ok');

    return value;
  } catch (e) {
    log('error', 'error during reload attempt');

    return null;
  }
};

const goForward = async (page) => {
  try {
    log('log', 'go forward: start');

    const value = await page.goForward();

    log('log', 'go forward: ok');

    return value;
  } catch (e) {
    log('error', 'error during go forward attempt');

    return null;
  }
};

const goBack = async (page) => {
  try {
    log('log', 'go back: start');

    const value = await page.goBack();

    log('log', 'go back: ok');

    return value;
  } catch (e) {
    log('error', 'error during go back attempt');

    return null;
  }
};

const triggerPageNavigation = async (page, direction) => {
  if (!direction) {
    return reload(page);
  }

  if (direction > 0) {
    return goForward(page);
  }

  if (direction < 0) {
    return goBack(page);
  }

  log('error', `unrecognized direction ${direction}`);

  return null;
};

module.exports = triggerPageNavigation;
