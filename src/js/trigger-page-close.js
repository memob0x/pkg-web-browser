import getPageTitleExcerpt from './get-page-title-excerpt';
import log from './log';

const triggerPageClose = async (page) => {
  const title = await getPageTitleExcerpt(page);

  try {
    log('log', `page "${title}" close`);

    await page.close();

    log('log', `page "${title}" closed`);
  } catch (e) {
    log('warning', `page "${title}" close failed a new attempt will be done on next loop iteration`);
  }
};

export default triggerPageClose;
