import getStringExcerpt from './get-string-excerpt';

const getPageTitleExcerpt = async (page) => {
  try {
    const title = await page.title();

    return `${getStringExcerpt(title)}...`;
  } catch (e) {
    return '';
  }
};

export default getPageTitleExcerpt;
