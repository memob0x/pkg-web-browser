(() => {
  const {
    addEventListener,

    document,
  } = globalThis;

  let currentIndex = -1;

  const classNameFocus = 'gamepad-browser-focus';

  const triggerTabNavigation = (index) => {
    const items = document.querySelectorAll('a, button, input, textarea');

    currentIndex += index;

    [...items].forEach((x) => x.classList.remove(classNameFocus));

    const item = items[currentIndex];

    item.focus();

    item.classList.add(classNameFocus);
  };

  addEventListener('gamepadbuttonpressr1', () => triggerTabNavigation(1));

  addEventListener('gamepadbuttonpressl1', () => triggerTabNavigation(-1));
})();
