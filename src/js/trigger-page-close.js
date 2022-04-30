const getPageTitleExcerpt = require('./get-page-title-excerpt');
const log = require('./log');

const triggerPageClose = async (page) => {
  try {
    log('log', `focus mode: page "${await getPageTitleExcerpt(page)}" closed`);

    return page.close();
  } catch (e) {
    log('warning', 'page close failed a new attempt will be done on next loop iteration');

    return null;
  }
};

module.exports = triggerPageClose;
