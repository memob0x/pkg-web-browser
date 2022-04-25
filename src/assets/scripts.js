const createGamepadSupport = require('../js/create-gamepad-support');
const createGamepadPointer = require('../js/create-gamepad-pointer');
const createGamepadScroller = require('../js/create-gamepad-scroller');

createGamepadSupport(globalThis);
createGamepadPointer(globalThis);
createGamepadScroller(globalThis);
