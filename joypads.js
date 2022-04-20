(() => {
  const {
    navigator,

    requestAnimationFrame,

    addEventListener,

    dispatchEvent,

    CustomEvent,
  } = globalThis;

  const { getGamepads } = navigator;

  const padsCollection = {};

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

  const axesNames = {
    0: 'analogleftx',
    1: 'analoglefty',
    2: 'analogrightx',
    3: 'analogrighty',
  };

  const indexExists = (index) => index in padsCollection;

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

  const possiblyAddPad = (pad) => {
    const index = getIndex(pad);

    if (typeof index === 'number') {
      padsCollection[index] = pad;
    }
  };

  const scanPads = () => getGamepads.call(navigator).forEach(possiblyAddPad);

  const parseButtons = () => Object.values(padsCollection).forEach((pad) => {
    const {
      buttons = [],

      axes = [],
    } = pad || {};

    buttons.forEach((button, buttonIndex) => {
      const { pressed, touched } = button || {};

      const type = buttonNames[buttonIndex];

      if (!type) {
        return;
      }

      if (pressed || touched) {
        const detail = { type };

        dispatchEvent(new CustomEvent('gamepadbuttonpress', { detail }));

        dispatchEvent(new CustomEvent(`gamepadbuttonpress${type}`, { detail }));
      }
    });

    axes.forEach((axis, axisIndex) => {
      const type = axesNames[axisIndex];

      if (!type) {
        return;
      }

      const detail = { type, axis };

      dispatchEvent(new CustomEvent('gamepadaxismove', { detail }));

      dispatchEvent(new CustomEvent(`gamepadaxismove${type}`, { detail }));
    });
  });

  const loopIteration = () => {
    scanPads();

    parseButtons();

    requestAnimationFrame(loopIteration);
  };

  loopIteration();

  addEventListener('gamepadconnected', ({ gamepad }) => possiblyAddPad(gamepad));

  addEventListener('gamepaddisconnected', ({ gamepad }) => possiblyRemovePad(gamepad));
})();
