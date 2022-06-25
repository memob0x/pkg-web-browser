const BOOL_LOG_LEVEL = 3; // 1 = only errors, 2 = errors and warnings, 3 = all

const log = async (type, arg) => {
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

  const date = new Date();

  // eslint-disable-next-line no-console
  console[type](
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,

    typeof arg === 'function' ? await arg() : arg,
  );

  return true;
};

export default log;
