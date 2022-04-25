const hasButtonPressed = require('./has-button-pressed');

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

  const gamepadButtonpressHandler = ({ detail }) => {
    if (hasButtonPressed(detail, 'r2')) {
      scroll(documentElement, 1);

      return;
    }

    if (hasButtonPressed(detail, 'l2')) {
      scroll(documentElement, -1);
    }
  };

  addEventListener('gamepadbuttonpress', gamepadButtonpressHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', gamepadButtonpressHandler);
  };

  return destroy;
};

module.exports = createGamepadScroller;
