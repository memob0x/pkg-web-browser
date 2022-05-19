import createGamepadSupport from './utils/create-gamepad-support';
import createGamepadPointer from './utils/create-gamepad-pointer';
import createGamepadFocusHighlighter from './utils/create-gamepad-focus-highlighter';
import createGamepadVirtualKeyboardSupport from './utils/create-gamepad-virtual-keyboard-support';
import createDocumentModifier from './utils/create-document-modifier';

const gamepadSupport = createGamepadSupport(globalThis);

const gamepadPointer = createGamepadPointer(globalThis);

const gamepadFocusHighlighter = createGamepadFocusHighlighter(globalThis);

const gamepadVirtualKeyboard = createGamepadVirtualKeyboardSupport(globalThis);

const documentModifier = createDocumentModifier(globalThis);

export default {
  gamepadSupport,

  gamepadPointer,

  gamepadFocusHighlighter,

  gamepadVirtualKeyboard,

  documentModifier,
};
