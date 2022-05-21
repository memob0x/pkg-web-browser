import getPageTitle from './get-page-title';
import getStringExcerpt from './get-string-excerpt';
import log from './log';

const triggerPageClose = async (page) => {
  const title = getStringExcerpt(await getPageTitle(page));

  try {
    log('log', `page "${title}" close`);

    await page.close();

    log('log', `page "${title}" closed`);
  } catch (e) {
    log('warning', `page "${title}" close failed a new attempt will be done on next loop iteration`);
  }
};

export default triggerPageClose;
