const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

module.exports = {
  gamepadSupport,

  gamepadPointer,
};
