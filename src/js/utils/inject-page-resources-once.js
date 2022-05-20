import getPageTitleExcerpt from './get-page-title-excerpt';
import hasPageInjectedResources from './has-page-injected-resources';
import injectPageResources from './inject-page-resources';
import log from './log';

const injectPageResourcesOnce = async (page, options) => {
  const title = await getPageTitleExcerpt(page);

  const { bypassCSP } = options || {};

  try {
    const isInjected = await hasPageInjectedResources(page);

    log('log', `page "${title}" injection:`, isInjected);

    if (!isInjected) {
      log('log', 'bypassing csp');

      if (bypassCSP) {
        await page.setBypassCSP(true);
      }

      log('log', 'csp bypassed');

      log('log', `page "${title}" injecting`);

      await injectPageResources(page, options);

      log('log', `page "${title}" injected`);
    }
  } catch (e) {
    log('warning', `page "${title}" injection failed`);
  }
};

export default injectPageResourcesOnce;
