const createGamepadPointer = (client = this) => {
  const {
    addEventListener,

    removeEventListener,

    dispatchEvent,

    CustomEvent,

    document,
  } = client;

  const pointer = document.createElement('div');

  const { classList: pointerCssClassList } = pointer;

  pointerCssClassList.add('gamepad-pointer');

  let pointerDeactivationTimeout;

  let left = 0;
  let top = 0;

  let shouldThrottleAnalogButtonPress = false;

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

  const gamepadButtonpressAnalogHandler = () => {
    if (shouldThrottleAnalogButtonPress) {
      return;
    }

    shouldThrottleAnalogButtonPress = true;

    setTimeout(() => {
      shouldThrottleAnalogButtonPress = false;
    }, 250);

    if (isPointerActive()) {
      dispatchEvent(new CustomEvent('gamepad:pointer:selection', { detail: pointer.getBoundingClientRect() }));

      deactivatePointer();

      return;
    }

    activatePointer();
  };

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

  addEventListener('gamepad:buttonpress:analog', gamepadButtonpressAnalogHandler);

  addEventListener('gamepad:analogmove', gamepadAnalogMoveHandler);

  const destroy = () => {
    removeEventListener('gamepad:buttonpress:analog', gamepadButtonpressAnalogHandler);

    removeEventListener('gamepad:analogmove', gamepadAnalogMoveHandler);
  };

  return destroy;
};

module.exports = createGamepadPointer;
