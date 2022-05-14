import getExcerpt from './get-excerpt';
import log from './log';

const evaluatePageCode = async (page, code) => {
  let codeExcerpt = typeof code === 'string' ? getExcerpt(code) : code;

  codeExcerpt = codeExcerpt.replace(/\r?\n|\r/g, ' ');

  try {
    log('log', `page code evaluation: start (${codeExcerpt})`);

    const value = await page.evaluate(code);

    log('log', `page code evaluation: ok ${value} (${codeExcerpt})`);

    return value;
  } catch (e) {
    log('error', 'error during page code evaluation');

    return null;
  }
};

export default evaluatePageCode;
