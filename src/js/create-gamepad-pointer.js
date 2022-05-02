const { INT_MS_THROTTLE_DELAY_LONG } = require('./constants');
const hasButtonPressed = require('./has-button-pressed');
const throttle = require('./throttle');

const createGamepadPointer = (client) => {
  const {
    addEventListener,

    removeEventListener,

    document,
  } = client || {};

  const element = document.createElement('div');

  const { classList } = element;

  let activeDeferred = false;

  classList.add('gamepad-pointer');

  let pointerDeactivationTimeout;

  let left = 0;
  let top = 0;

  const deactivate = () => {
    clearTimeout(pointerDeactivationTimeout);

    classList.remove('gamepad-pointer--active');

    setTimeout(() => {
      activeDeferred = false;
    });
  };

  const activate = () => {
    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(element)) {
      body.append(element);
    }

    classList.add('gamepad-pointer--active');

    clearTimeout(pointerDeactivationTimeout);

    pointerDeactivationTimeout = setTimeout(deactivate, 4000);

    setTimeout(() => {
      activeDeferred = true;
    });
  };

  const isActive = () => classList.contains('gamepad-pointer--active');

  const gamepadButtonpressAnalogHandler = throttle(({ detail }) => {
    if (!hasButtonPressed(detail, 'analogleft') && !hasButtonPressed(detail, 'analogright')) {
      return;
    }

    if (isActive()) {
      deactivate();

      return;
    }

    activate();
  }, INT_MS_THROTTLE_DELAY_LONG);

  const gamepadAnalogMoveHandler = ({ detail }) => {
    if (!isActive()) {
      return;
    }

    const { analog } = detail;

    left += analog[0] * 50;
    top += analog[1] * 50;

    const { documentElement } = document;

    const { style } = documentElement;

    style.setProperty('--gamepad-pointer-left', `${left}px`);
    style.setProperty('--gamepad-pointer-top', `${top}px`);

    activate();
  };

  addEventListener('gamepadbuttonpress', gamepadButtonpressAnalogHandler);

  addEventListener('gamepadanalogmove', gamepadAnalogMoveHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', gamepadButtonpressAnalogHandler);

    removeEventListener('gamepadanalogmove', gamepadAnalogMoveHandler);
  };

  return {
    get element() {
      return element;
    },

    get boundingRect() {
      return element.getBoundingClientRect();
    },

    get active() {
      return isActive();
    },

    get activeDeferred() {
      return activeDeferred;
    },

    activate,

    deactivate,

    destroy,
  };
};

module.exports = createGamepadPointer;
