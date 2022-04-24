const { STRING_INJECTED_FLAG_NAME } = require('./constants');

const hasPageInjectedResources = (page) => page.evaluate(STRING_INJECTED_FLAG_NAME);

module.exports = hasPageInjectedResources;
