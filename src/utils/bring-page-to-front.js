import getPageTitle from './get-page-title';
import getStringExcerpt from './get-string-excerpt';
import log from './log';

const bringPageToFront = async (page) => {
  log('log', `focus mode: page "${getStringExcerpt(await getPageTitle(page))}" taken to front`);

  return page.bringToFront();
};

export default bringPageToFront;
