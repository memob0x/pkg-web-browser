import roundDecimals from './round-decimals';

const buttonNames = {
  0: 'a',
  1: 'b',
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

  12: 'dpadup',
  13: 'dpaddown',
  14: 'dpadleft',
  15: 'dpadright',
};

const createGamepadSupport = (client) => {
  const {
    navigator,

    requestAnimationFrame,

    addEventListener,

    removeEventListener,

    dispatchEvent,

    CustomEvent,
  } = client || {};

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

    if (buttons.some((x) => x.pressed || x.touched)) {
      const detail = buttons.reduce((accumulator, { value, pressed, touched }, buttonIndex) => {
        const name = buttonNames[buttonIndex];

        if (!name) {
          return accumulator;
        }

        const button = { value, pressed, touched };

        accumulator.push({ name, button });

        return accumulator;
      }, []);

      dispatchEvent(new CustomEvent('gamepadbuttonpress', { detail }));
    }

    const [lx, ly, rx, ry] = axes;

    [
      [lx, ly],

      [rx, ry],
    ].forEach((analogRaw, analogIndex) => {
      const name = !analogIndex ? 'left' : 'right';

      const analog = [
        roundDecimals(analogRaw[0], 10),

        roundDecimals(analogRaw[1], 10),
      ];

      if (`${state[name]}` === `${analog}`) {
        return;
      }

      state[name] = analog;

      const detail = { name, analog };

      dispatchEvent(new CustomEvent('gamepadanalogmove', { detail }));
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

  return { destroy };
};

export default createGamepadSupport;
