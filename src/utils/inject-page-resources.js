import log from './log';
import evaluatePageCode from './evaluate-page-code';

import { STRING_INJECTED_FLAG_NAME } from '../constants';

const injectPageResources = async (page, options) => {
  const {
    css,

    js,
  } = options || {};

  log('log', 'files injection: start');

  // NOTE: since addScriptTag could take a while, the injection flag need to be set at this point
  await evaluatePageCode(page, `window.${STRING_INJECTED_FLAG_NAME} = {};`);

  await Promise.all([
    page.addStyleTag({ content: css }),

    page.addScriptTag({ content: js }),
  ]);

  log('log', 'files injection: ok');
};

export default injectPageResources;
