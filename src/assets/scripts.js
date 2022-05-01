const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');
const createGamepadFocusHighlighter = require('../js/create-gamepad-focus-highlighter');
const createVirtualKeyboardSupport = require('../js/create-virtual-keyboard-support');

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

const gamepadFocusHighlighter = createGamepadFocusHighlighter(globalThis);

const virtualKeyboard = createVirtualKeyboardSupport(globalThis);

module.exports = {
  gamepadSupport,

  gamepadPointer,

  gamepadFocusHighlighter,

  virtualKeyboard,
};
