const log = require('./log');
const sleep = require('./sleep');

const pollOtherPagesClose = async (browser, mainPage) => {
  const closure = async () => {
    try {
      const pages = await browser.pages();

      await mainPage.bringToFront();

      const mainTitle = await mainPage.title();

      await Promise.all(pages.map(async (page, index) => {
        const title = await page.title();

        if (
          // is main page index
          index === 0

          // has same title of the main page
          || title === mainTitle

          // is dev tools
          || title.startsWith('DevTools')
        ) {
          return null;
        }

        log('log', `closing page ${title}`);

        return page.close();
      }));
    } catch (e) {
      //
    }

    await sleep(75);

    await pollOtherPagesClose(browser, mainPage);
  };

  await closure();
};

module.exports = pollOtherPagesClose;
