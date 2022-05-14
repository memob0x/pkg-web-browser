import getExcerpt from './get-excerpt';

const getPageTitleExcerpt = async (page) => {
  try {
    const title = await page.title();

    return `${getExcerpt(title)}...`;
  } catch (e) {
    return '';
  }
};

export default getPageTitleExcerpt;
