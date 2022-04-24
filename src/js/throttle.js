const throttle = (fn, ms) => {
  let timeout = null;

  return (...args) => {
    if (timeout !== null) {
      return;
    }

    timeout = setTimeout(() => {
      timeout = null;
    }, ms);

    fn(...args);
  };
};

module.exports = throttle;
