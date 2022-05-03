import log from './log';

const evaluatePageCode = async (page, code) => {
  try {
    log('log', 'page code evaluation: start');

    const value = await page.evaluate(code);

    log('log', `page code evaluation: ok ${value}`);

    return value;
  } catch (e) {
    log('error', 'error during page code evaluation');

    return null;
  }
};

export default evaluatePageCode;
