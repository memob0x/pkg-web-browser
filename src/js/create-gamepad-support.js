const buttonNames = {
  0: 'b',
  1: 'a',
  2: 'y',
  3: 'x',

  4: 'l1',
  5: 'r1',
  6: 'l2',
  7: 'r2',

  8: 'select',
  9: 'start',

  10: 'analogleft',
  11: 'analogright',

  12: 'dpadtop',
  13: 'dpaddown',
  14: 'dpadleft',
  15: 'dpadright',
};

const createGamepadSupport = (client = this) => {
  const {
    navigator,

    requestAnimationFrame,

    addEventListener,

    removeEventListener,

    dispatchEvent,

    CustomEvent,
  } = client;

  const { getGamepads } = navigator;

  const padsCollection = {};

  const indexExists = (index) => !!padsCollection[index];

  const getIndex = (pad) => {
    const { index } = pad || {};

    return index;
  };

  const possiblyRemovePad = (pad) => {
    const index = getIndex(pad);

    if (indexExists(index)) {
      delete padsCollection[index];
    }
  };

  const possiblyAddPad = (gamepad) => {
    const index = getIndex(gamepad);

    if (typeof index === 'number') {
      const { state = {} } = padsCollection[index] || {};

      padsCollection[index] = {
        gamepad,

        state,
      };
    }
  };

  const scanPads = () => getGamepads.call(navigator).forEach(possiblyAddPad);

  const parseButtons = () => Object.values(padsCollection).forEach((entry) => {
    const { gamepad, state } = entry;

    const {
      buttons = [],

      axes = [],
    } = gamepad;

    buttons.forEach((button, buttonIndex) => {
      const { pressed, touched } = button || {};

      const type = buttonNames[buttonIndex];

      if (!type || (!pressed && !touched)) {
        return;
      }

      const detail = { type };

      dispatchEvent(new CustomEvent('gamepad:buttonpress', { detail }));

      if (type === 'a' || type === 'b' || type === 'x' || type === 'y') {
        dispatchEvent(new CustomEvent('gamepad:buttonpress:abxy', { detail }));
      }

      if (type.startsWith('dpad')) {
        dispatchEvent(new CustomEvent('gamepad:buttonpress:dpad', { detail }));
      }

      if (type.startsWith('analog')) {
        dispatchEvent(new CustomEvent('gamepad:buttonpress:analog', { detail }));
      }

      if (type.endsWith('1')) {
        dispatchEvent(new CustomEvent('gamepad:buttonpress:shoulder', { detail }));
      }

      if (type.endsWith('2')) {
        dispatchEvent(new CustomEvent('gamepad:buttonpress:trigger', { detail }));
      }

      dispatchEvent(new CustomEvent(`gamepad:buttonpress:${type}`, { detail }));
    });

    const [lx, ly, rx, ry] = axes;

    const roundDecimals = (x, p) => Math.round(x * p) / p;

    [
      [lx, ly],

      [rx, ry],
    ].forEach((analogRaw, analogIndex) => {
      const type = !analogIndex ? 'left' : 'right';

      const analog = [
        roundDecimals(analogRaw[0], 10),

        roundDecimals(analogRaw[1], 10),
      ];

      if (`${state[type]}` === `${analog}`) {
        return;
      }

      state[type] = analog;

      const detail = { type, analog };

      dispatchEvent(new CustomEvent('gamepad:analogmove', { detail }));

      dispatchEvent(new CustomEvent(`gamepad:analogmove:${type}`, { detail }));
    });
  });

  let hasBeenDestroyed = false;

  const loopIteration = () => {
    if (hasBeenDestroyed) {
      return;
    }

    scanPads();

    parseButtons();

    requestAnimationFrame(loopIteration);
  };

  loopIteration();

  const gamepadConnectedHandler = ({ gamepad }) => possiblyAddPad(gamepad);

  const gamepadDisconnectedHandler = ({ gamepad }) => possiblyRemovePad(gamepad);

  addEventListener('gamepadconnected', gamepadConnectedHandler);

  addEventListener('gamepaddisconnected', gamepadDisconnectedHandler);

  const destroy = () => {
    hasBeenDestroyed = true;

    removeEventListener('gamepadconnected', gamepadConnectedHandler);

    removeEventListener('gamepaddisconnected', gamepadDisconnectedHandler);
  };

  return destroy;
};

module.exports = createGamepadSupport;
