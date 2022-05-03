const queryPage = async (page, selector) => {
  if (Array.isArray(page)) {
    return page.reduce(
      async (accumulator, p) => (await accumulator).concat(
        await queryPage(p, selector),
      ),

      Promise.resolve([]),
    );
  }

  if (!page) {
    return null;
  }

  return page.$$(selector);
};

export default queryPage;
