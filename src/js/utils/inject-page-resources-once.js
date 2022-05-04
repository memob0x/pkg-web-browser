import getPageTitleExcerpt from './get-page-title-excerpt';
import hasPageInjectedResources from './has-page-injected-resources';
import injectPageResources from './inject-page-resources';
import log from './log';
import setPageInjectionFlag from './set-page-injection-flag';

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

export default injectPageResourcesOnce;
