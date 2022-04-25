const { STRING_INJECTED_FLAG_NAME } = require('./constants');

const setPageInjectionFlag = (page, value) => page.evaluate(`window.${STRING_INJECTED_FLAG_NAME} = ${value};`);

module.exports = setPageInjectionFlag;
