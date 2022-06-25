const awaitSafaly = async (promise, defaultReturnedValue) => {
  try {
    return await promise;
  } catch (_e) {
    return defaultReturnedValue;
  }
};

export default awaitSafaly;
