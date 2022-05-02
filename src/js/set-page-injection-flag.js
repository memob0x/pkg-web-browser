const { STRING_INJECTED_FLAG_NAME } = require('./constants');
const evaluatePageCode = require('./evaluate-page-code');

const setPageInjectionFlag = (page, value) => evaluatePageCode(page, `window.${STRING_INJECTED_FLAG_NAME} = ${value};`);

module.exports = setPageInjectionFlag;
