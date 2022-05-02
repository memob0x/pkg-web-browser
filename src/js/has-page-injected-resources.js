const { STRING_INJECTED_FLAG_NAME } = require('./constants');
const evaluatePageCode = require('./evaluate-page-code');

const hasPageInjectedResources = async (page) => {
  const value = await evaluatePageCode(page, `window.${STRING_INJECTED_FLAG_NAME}`);

  return !!value;
};

module.exports = hasPageInjectedResources;
