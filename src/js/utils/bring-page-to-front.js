import getPageTitleExcerpt from './get-page-title-excerpt';
import log from './log';

const bringPageToFront = async (page) => {
  log('log', `focus mode: page "${await getPageTitleExcerpt(page)}" taken to front`);

  return page.bringToFront();
};

export default bringPageToFront;
