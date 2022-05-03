import createGamepadSupport from '../js/create-gamepad-support';
import createGamepadPointer from '../js/create-gamepad-pointer';
import createGamepadFocusHighlighter from '../js/create-gamepad-focus-highlighter';
import createGamepadVirtualKeyboardSupport from '../js/create-gamepad-virtual-keyboard-support';

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

const gamepadFocusHighlighter = createGamepadFocusHighlighter(globalThis);

const gamepadVirtualKeyboard = createGamepadVirtualKeyboardSupport(globalThis);

export default {
  gamepadSupport,

  gamepadPointer,

  gamepadFocusHighlighter,

  gamepadVirtualKeyboard,
};
