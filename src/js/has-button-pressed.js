const hasButtonPressed = (buttons, name) => buttons.findIndex(
  (x) => name === x.name && x.button.pressed,
) > -1;

module.exports = hasButtonPressed;
