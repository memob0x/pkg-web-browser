(({
  addEventListener,

  dispatchEvent,

  CustomEvent,

  document,
}) => {
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

  addEventListener('gamepad:buttonpress:analog', () => {
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
  });

  addEventListener('gamepad:analogmove', ({ detail }) => {
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
  });
})(globalThis);
