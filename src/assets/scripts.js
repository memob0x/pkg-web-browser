const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');
const createGamepadScroller = require('../js/create-gamepad-scroller');
const createGamepadFocusHighlighter = require('../js/create-gamepad-focus-highlighter');

createGamepadSupport(globalThis);
createGamepadPointer(globalThis);
createGamepadScroller(globalThis);
createGamepadFocusHighlighter(globalThis);
