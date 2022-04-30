const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');
const createGamepadFocusHighlighter = require('../js/create-gamepad-focus-highlighter');

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

const gamepadFocusHighlighter = createGamepadFocusHighlighter(globalThis);

module.exports = {
  gamepadSupport,

  gamepadPointer,

  gamepadFocusHighlighter,
};
