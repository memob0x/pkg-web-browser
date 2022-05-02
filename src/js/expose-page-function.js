const log = require('./log');

const exposePageFunction = async (page, name, fn) => {
  log('log', `handler ${name}: start`);

  try {
    await page.exposeFunction(name, fn);

    log('log', `handler ${name}: ok`);
  } catch (e) {
    log('log', `handler ${name}: ok, skip (handler was probably already exposed)`);
  }
};

module.exports = exposePageFunction;
