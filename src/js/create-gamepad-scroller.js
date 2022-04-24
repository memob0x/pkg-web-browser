const scroll = (el, factor) => {
  el.scrollTo({
    top: el.scrollTop + 250 * factor,
    left: 0,
    behavior: 'smooth',
  });
};

const createGamepadScroller = (client) => {
  const { addEventListener, removeEventListener, document } = client || {};

  const { documentElement } = document;

  const gamepadButtonpressR2Handler = () => scroll(documentElement, 1);

  const gamepadButtonpressL2Handler = () => scroll(documentElement, -1);

  addEventListener('gamepad:buttonpress:r2', gamepadButtonpressR2Handler);

  addEventListener('gamepad:buttonpress:l2', gamepadButtonpressL2Handler);

  const destroy = () => {
    removeEventListener('gamepad:buttonpress:r2', gamepadButtonpressR2Handler);

    removeEventListener('gamepad:buttonpress:l2', gamepadButtonpressL2Handler);
  };

  return destroy;
};

module.exports = createGamepadScroller;
