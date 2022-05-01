const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');
const createGamepadFocusHighlighter = require('../js/create-gamepad-focus-highlighter');
const createGamepadVirtualKeyboardSupport = require('../js/create-gamepad-virtual-keyboard-support');

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

const gamepadFocusHighlighter = createGamepadFocusHighlighter(globalThis);

const gamepadVirtualKeyboard = createGamepadVirtualKeyboardSupport(globalThis);

module.exports = {
  gamepadSupport,

  gamepadPointer,

  gamepadFocusHighlighter,

  gamepadVirtualKeyboard,
};
