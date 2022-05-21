import log from './log';

const tryout = async (action, i, limit = 2) => {
  try {
    const result = await action();

    return result;
  } catch (e) {
    log('log', `execution attempt n°${i} (of ${limit}) failed (Error: ${e.message})`);

    if (i === limit) {
      throw new Error('Execution retries number reached, the given function threw errors everytime.');
    }

    return tryout(action, i + 1, limit);
  }
};

const executeFunctionWithRetry = (action, retries) => tryout(action, 0, retries);

export default executeFunctionWithRetry;
