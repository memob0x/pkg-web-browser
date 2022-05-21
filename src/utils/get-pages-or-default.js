import executeFunctionWithRetry from './execute-function-with-retry';
import getPages from './get-pages';

const getPagesOrDefault = async (browser) => {
  try {
    const pages = await executeFunctionWithRetry(() => getPages(browser), 2);

    return pages;
  } catch (e) {
    return [];
  }
};

export default getPagesOrDefault;
