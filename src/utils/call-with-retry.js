const tryout = async (action, i, limit = 2) => {
  try {
    return await action();
  } catch ({ message, stack }) {
    if (i === limit) {
      throw new Error('Execution retries number reached, the given function threw errors everytime.');
    }

    return tryout(action, i + 1, limit);
  }
};

const callWithRetry = (action, retries) => tryout(action, 0, retries);

export default callWithRetry;
