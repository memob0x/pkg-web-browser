const reload = async (page, inBrowser) => {
  if (inBrowser) {
    await page.evaluate('window.location.reload();');

    return;
  }

  await page.reload();
};

const goForward = async (page, inBrowser) => {
  if (inBrowser) {
    await page.evaluate('window.history.forward()');

    return;
  }

  await page.goForward();
};

const goBack = async (page, inBrowser) => {
  if (inBrowser) {
    await page.evaluate('window.history.back();');

    return;
  }

  await page.goBack();
};

const triggerPageNavigation = async (page, direction, inBrowser) => {
  if (!direction) {
    await reload(page, inBrowser);

    return;
  }

  if (direction > 0) {
    await goForward(page, inBrowser);

    return;
  }

  if (direction < 0) {
    await goBack(page, inBrowser);
  }
};

module.exports = triggerPageNavigation;
