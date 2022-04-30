const getPageTitleExcerpt = require('./get-page-title-excerpt');
const hasPageInjectedResources = require('./has-page-injected-resources');
const injectPageResources = require('./inject-page-resources');
const log = require('./log');
const setPageInjectionFlag = require('./set-page-injection-flag');

const injectPageResourcesOnce = async (page, options) => {
  try {
    const isInjected = await hasPageInjectedResources(page);

    log('log', `page "${await getPageTitleExcerpt(page)}" injection:`, isInjected);

    if (!isInjected) {
      await setPageInjectionFlag(page, true);

      log('log', 'injecting');

      await injectPageResources(page, options);

      log('log', 'injected');
    }
  } catch (e) {
    log('warning', 'injection failed, a new attempt will be done on next loop iteration');
  }
};

module.exports = injectPageResourcesOnce;
