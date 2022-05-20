import evaluatePageCode from './evaluate-page-code';

const injectPageAntiPopupPolicy = (page) => evaluatePageCode(page, () => {
  const { document } = globalThis || {};

  // links with target attr most likely would not keep navigation in same page...
  const linksWithTarget = [...document.querySelectorAll('a[target]')];

  linksWithTarget.forEach((x) => x.removeAttribute('target'));

  globalThis.console.log(`found ${linksWithTarget.length} links with target`);

  // removes anything that has a ultra high zIndex, only nasty elements has a zIndex like that
  const nastyOverlayItems = [...document.querySelectorAll('div, span, a, iframe')].reduce((p, x) => {
    const { zIndex } = globalThis.getComputedStyle(x) || {};

    if (zIndex > 5000) {
      return p.concat(x);
    }

    return p;
  }, []);

  nastyOverlayItems.forEach((x) => x.remove());

  globalThis.console.log(`found ${nastyOverlayItems.length} overlay items`);

  // a little hardcore, but effective way to prevent any programmatic window opening
  globalThis.open = () => {};

  globalThis.console.log('overwritten global window open method');
});

export default injectPageAntiPopupPolicy;
