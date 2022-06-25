const disallowNewPages = (win = globalThis || {}) => {
  const { document, console } = win;

  // links with target attr most likely would not keep navigation in same page...
  [...document?.querySelectorAll('a[target]') || []].forEach((aTarget) => aTarget.removeAttribute('target'));

  const { log } = console || {};

  // a little hardcore, but effective way to prevent any programmatic window opening
  if (win.open !== log) {
    // eslint-disable-next-line no-param-reassign
    win.open = log;
  }
};

export default disallowNewPages;
