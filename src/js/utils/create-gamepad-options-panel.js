const STRING_CSS_CLASS_NAME = 'gamepad-options-panel';

const createGamepadOptions = (client) => {
  const {
    addEventListener,

    removeEventListener,

    document,
  } = client || {};

  const element = document.createElement('div');

  const { classList } = element;

  classList.add(STRING_CSS_CLASS_NAME);

  const gamepadButtonPressHandler = () => {
    // TODO: ...
  };

  addEventListener('gamepadbuttonpress', gamepadButtonPressHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', gamepadButtonPressHandler);
  };

  return {
    get element() {
      return element;
    },

    destroy,
  };
};

export default createGamepadOptions;
