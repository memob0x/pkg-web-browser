const throttle = (func, delay) => {
  let timeout;

  return (...args) => {
    if (!timeout) {
      func(...args);

      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    }
  };
};

const INT_TIME_MS_THROTTLE = 125;

(() => {
  const {
    addEventListener,

    document,
  } = globalThis;

  let currentIndex = -1;

  const classNameFocus = 'gamepad-browser-focus';

  const triggerTabNavigation = (index) => {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex]');

    const { length } = focusableElements;

    const maxIndex = length - 1;

    currentIndex += index;

    currentIndex = currentIndex < 0 ? maxIndex : currentIndex;
    currentIndex = currentIndex > maxIndex ? 0 : currentIndex;

    [...focusableElements].forEach((x) => x.classList.remove(classNameFocus));

    const item = focusableElements[currentIndex];

    item.focus();

    item.classList.add(classNameFocus);
  };

  addEventListener('gamepadbuttonpressr1', throttle(() => triggerTabNavigation(1), INT_TIME_MS_THROTTLE));

  addEventListener('gamepadbuttonpressl1', throttle(() => triggerTabNavigation(-1), INT_TIME_MS_THROTTLE));
})();
