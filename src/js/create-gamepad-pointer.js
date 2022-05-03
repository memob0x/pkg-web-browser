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

  const gamepadAnalogMoveHandler = ({ detail }) => {
    const { name, analog } = detail;

    if (name !== 'right') {
      return;
    }

    const [x, y] = analog || [];

    left += x * 50;
    top += y * 50;

    const { documentElement } = document;

    const { style } = documentElement;

    style.setProperty('--gamepad-pointer-left', `${left}px`);
    style.setProperty('--gamepad-pointer-top', `${top}px`);

    activate();
  };

  addEventListener('gamepadbuttonpress', deactivate);

  addEventListener('gamepadanalogmove', gamepadAnalogMoveHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', deactivate);

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

export default createGamepadPointer;
