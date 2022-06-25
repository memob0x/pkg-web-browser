const rejectAfterTimeout = (timeout) => new Promise((_resolve, reject) => {
  setTimeout(
    () => reject(new Error(`Waiting time of ${timeout}ms for the promise to resolve reached.`)),

    timeout,
  );
});

const awaitWithTimeout = async (promise, timeout = 1000) => {
  let promises = Array.isArray(promise) ? promise : [promise];

  promises = promises.concat(rejectAfterTimeout(timeout));

  await Promise.race(promises);

  return promise;
};

export default awaitWithTimeout;
