const { BOOL_LOG_LEVEL } = require('./constants');

const log = (type, ...args) => {
  const isError = type === 'error';
  const isWarning = type === 'warn';
  const isLog = type === 'log';

  if (
    // no logs allowed (any level)
    !BOOL_LOG_LEVEL
    // invalid command
    || (!isLog && !isWarning && !isError)
    // "log" level is not allowed
    || (isLog && BOOL_LOG_LEVEL < 3)
    // "warn level" is not allowed
    || (isWarning && BOOL_LOG_LEVEL < 2)
  ) {
    return false;
  }

  // eslint-disable-next-line no-console
  console[type](...args);

  return true;
};

module.exports = log;
