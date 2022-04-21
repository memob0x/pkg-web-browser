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

const INT_TIME_MS_THROTTLE = 250;

(() => {
  const {
    addEventListener,

    document,
  } = globalThis;

  const { documentElement } = document;

  let currentIndex = -1;

  const classNameFocus = 'gamepad-browser-focus';

  const eee = () => [...document.querySelectorAll('a, button, input, textarea, [tabindex]')];

  const triggerFocus = (x) => {
    currentIndex = eee().findIndex((y) => x === y);

    return x && x.focus();
  };

  const triggerTabNavigation = (index) => {
    const focusableElements = eee();

    const { length } = focusableElements;

    const maxIndex = length - 1;

    currentIndex += index;

    currentIndex = currentIndex < 0 ? maxIndex : currentIndex;
    currentIndex = currentIndex > maxIndex ? 0 : currentIndex;

    [...focusableElements].forEach((x) => x.classList.remove(classNameFocus));

    const item = focusableElements[currentIndex];

    triggerFocus(item);

    item.classList.add(classNameFocus);
  };

  const scroll = (factor) => {
    documentElement.scrollTo({
      top: documentElement.scrollTop + 500 * factor,
      left: 0,
      behavior: 'smooth',
    });
  };

  let pointerTimeout;

  const pointer = document.createElement('div');

  const { classList } = pointer;

  classList.add('gamepad-browser-cursor');

  let left = 0;
  let top = 0;

  const zzz = () => clearTimeout(pointerTimeout);

  const bbb = () => {
    zzz();

    classList.remove('gamepad-browser-cursor--active');
  };

  const aaa = () => {
    if (!document.body.contains(pointer)) {
      document.body.append(pointer);
    }

    classList.add('gamepad-browser-cursor--active');

    zzz();

    pointerTimeout = setTimeout(bbb, 4000);
  };

  const ccc = () => classList.contains('gamepad-browser-cursor--active');

  addEventListener('gamepad:buttonpress:analog', throttle(() => {
    if (ccc()) {
      bbb();

      return;
    }

    aaa();
  }, INT_TIME_MS_THROTTLE));

  addEventListener('gamepad:analogmove', ({ detail }) => {
    if (!ccc()) {
      return;
    }

    const { analog } = detail;

    left += analog[0] * 50;
    top += analog[1] * 50;

    documentElement.style.setProperty('--cursor-left', `${left}px`);
    documentElement.style.setProperty('--cursor-top', `${top}px`);

    aaa();
  });

  const overlaps = (a, b) => !(a.right < b.left
    || a.left > b.right
    || a.bottom < b.top
    || a.top > b.bottom);

  const ddd = () => {
    const pointerRect = pointer.getBoundingClientRect();

    // FIXME: should get the most under cursor, not the first one...
    const [itemUnderPointer] = eee()
      .filter((x) => overlaps(x.getBoundingClientRect(), pointerRect));

    if (triggerFocus(itemUnderPointer)) {
      bbb();
    }
  };

  addEventListener('gamepad:buttonpress:r1', throttle(() => {
    if (ccc()) {
      ddd();

      return;
    }

    triggerTabNavigation(1);
  }, INT_TIME_MS_THROTTLE));

  addEventListener('gamepad:buttonpress:l1', throttle(() => {
    if (ccc()) {
      ddd();

      return;
    }

    triggerTabNavigation(-1);
  }, INT_TIME_MS_THROTTLE));

  addEventListener('gamepad:buttonpress:r2', throttle(() => scroll(1), INT_TIME_MS_THROTTLE));

  addEventListener('gamepad:buttonpress:l2', throttle(() => scroll(-1), INT_TIME_MS_THROTTLE));

  const triggerClickOnFocusElement = () => document.activeElement.click();

  addEventListener('gamepad:buttonpress:abxy', throttle(() => {
    if (ccc()) {
      ddd();

      return;
    }

    triggerClickOnFocusElement();
  }, INT_TIME_MS_THROTTLE));
})();