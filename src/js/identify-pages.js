const identifyPages = async (browser) => {
  const [mainPage, ...otherPages] = await browser.pages();

  const otherPagesFiltered = await otherPages.reduce(
    async (accumulator, page) => {
      const title = await page.title();

      if (title.startsWith('DevTools')) {
        return accumulator;
      }

      const accumulatorResolved = await accumulator;

      accumulatorResolved.push(page);

      return accumulatorResolved;
    },

    Promise.resolve([]),
  );

  return [
    mainPage,

    otherPagesFiltered,
  ];
};

module.exports = identifyPages;
