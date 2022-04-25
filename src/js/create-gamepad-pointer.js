const { INT_MS_THROTTLE_DELAY } = require('./constants');
const hasButtonPressed = require('./has-button-pressed');
const throttle = require('./throttle');

const createGamepadPointer = (client) => {
  const {
    addEventListener,

    removeEventListener,

    dispatchEvent,

    CustomEvent,

    document,
  } = client || {};

  const pointer = document.createElement('div');

  const { classList: pointerCssClassList } = pointer;

  pointerCssClassList.add('gamepad-pointer');

  let pointerDeactivationTimeout;

  let left = 0;
  let top = 0;

  const deactivatePointer = () => {
    clearTimeout(pointerDeactivationTimeout);

    pointerCssClassList.remove('gamepad-pointer--active');
  };

  const activatePointer = () => {
    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(pointer)) {
      body.append(pointer);
    }

    pointerCssClassList.add('gamepad-pointer--active');

    clearTimeout(pointerDeactivationTimeout);

    pointerDeactivationTimeout = setTimeout(deactivatePointer, 4000);
  };

  const isPointerActive = () => pointerCssClassList.contains('gamepad-pointer--active');

  const gamepadButtonpressAnalogHandler = throttle(({ detail }) => {
    if (!hasButtonPressed(detail, 'analogleft') && !hasButtonPressed(detail, 'analogright')) {
      return;
    }

    if (isPointerActive()) {
      dispatchEvent(new CustomEvent('gamepadpointerselection', { detail: pointer.getBoundingClientRect() }));

      deactivatePointer();

      return;
    }

    activatePointer();
  }, INT_MS_THROTTLE_DELAY);

  const gamepadAnalogMoveHandler = ({ detail }) => {
    if (!isPointerActive()) {
      return;
    }

    const { analog } = detail;

    left += analog[0] * 50;
    top += analog[1] * 50;

    const { documentElement } = document;

    const { style } = documentElement;

    style.setProperty('--gamepad-pointer-left', `${left}px`);
    style.setProperty('--gamepad-pointer-top', `${top}px`);

    activatePointer();
  };

  addEventListener('gamepadbuttonpress', gamepadButtonpressAnalogHandler);

  addEventListener('gamepadanalogmove', gamepadAnalogMoveHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', gamepadButtonpressAnalogHandler);

    removeEventListener('gamepadanalogmove', gamepadAnalogMoveHandler);
  };

  return destroy;
};

module.exports = createGamepadPointer;
