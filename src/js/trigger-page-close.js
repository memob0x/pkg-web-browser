const getPageTitleExcerpt = require('./get-page-title-excerpt');
const log = require('./log');

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

module.exports = triggerPageClose;
