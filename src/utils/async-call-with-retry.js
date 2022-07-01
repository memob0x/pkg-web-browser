const asyncCallWithRetryLoopIteration = async (action, iterationCount = 0, iterationsLimit = 2) => {
  try {
    return await action();
  } catch ({ message, stack }) {
    if (iterationCount === iterationsLimit) {
      throw new Error('Execution retries number reached, the given function threw errors everytime.');
    }

    return asyncCallWithRetryLoopIteration(action, iterationCount + 1, iterationsLimit);
  }
};

const asyncCallWithRetry = (action, retries) => asyncCallWithRetryLoopIteration(
  action,

  0,

  retries,
);

export default asyncCallWithRetry;
