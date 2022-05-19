import appendElementOnce from './append-element-once';

const createGamepadPointer = (client) => {
  const {
    addEventListener,

    removeEventListener,

    document,

    innerWidth,

    innerHeight,
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
    if (!appendElementOnce(document, element)) {
      return;
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

    const minBoundX = 0;
    const minBoundY = 0;

    const maxBoundX = innerWidth;
    const maxBoundY = innerHeight;

    left = left < minBoundX ? minBoundX : left;
    top = top < minBoundY ? minBoundY : top;

    left = left > maxBoundX ? maxBoundX : left;
    top = top > maxBoundY ? maxBoundY : top;

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