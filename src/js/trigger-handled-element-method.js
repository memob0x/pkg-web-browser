const log = require('./log');

const triggerHandledElementMethod = async (element, method) => {
  try {
    await element[method]();
  } catch ({ message }) {
    log('error', message);
  }
};

module.exports = triggerHandledElementMethod;
