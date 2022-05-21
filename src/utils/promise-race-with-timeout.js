const promiseRaceWithTimeout = (promises, timeout = 1000) => Promise.race(
  promises.concat(
    new Promise((_resolve, reject) => {
      setTimeout(() => reject(new Error(`Waiting time of ${timeout}ms for the promise to resolve reached.`)), timeout);
    }),
  ),
);

export default promiseRaceWithTimeout;
