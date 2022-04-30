const INT_TITLE_MAX_LENGTH = 10;

const getPageTitleExcerpt = async (page) => {
  const title = await page.title();

  const { length } = title || '';

  if (length <= INT_TITLE_MAX_LENGTH) {
    return title;
  }

  return `${title.slice(0, 10)}...`;
};

module.exports = getPageTitleExcerpt;
