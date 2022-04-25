const { BOOL_LOG_LEVEL } = require('./constants');

const log = (type, ...args) => {
  if (
    !BOOL_LOG_LEVEL
    || (type === 'log' && BOOL_LOG_LEVEL < 3)
    || (type === 'warn' && BOOL_LOG_LEVEL < 2)
  ) {
    return;
  }

  console[type](...args);
};

module.exports = log;
