const identifyPages = async (browser) => {
  const pages = await browser.pages();

  return pages.reduce(
    async (accumulator, page, index) => {
      const title = await page.title();

      if (title.startsWith('DevTools')) {
        return accumulator;
      }

      const identifiedPages = await accumulator;

      let { main } = identifiedPages;

      const { other } = identifiedPages;

      if (!index) {
        main = !main ? page : main;

        return { main, other };
      }

      other.push(page);

      return { main, other };
    },

    Promise.resolve({
      main: null,

      other: [],
    }),
  );
};

module.exports = identifyPages;
