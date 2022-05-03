import { STRING_INJECTED_FLAG_NAME } from './constants';
import evaluatePageCode from './evaluate-page-code';

const hasPageInjectedResources = async (page) => {
  const value = await evaluatePageCode(page, `window.${STRING_INJECTED_FLAG_NAME}`);

  return !!value;
};

export default hasPageInjectedResources;
