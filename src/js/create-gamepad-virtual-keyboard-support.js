const { default: Keyboard } = require('simple-keyboard');
const { default: KeyNavigator } = require('simple-keyboard-key-navigation');
const hasButtonPressed = require('./has-button-pressed');
const throttle = require('./throttle');

const { INT_MS_THROTTLE_DELAY_LONG } = require('./constants');

// {bksp} {tab} {lock} {shift}...
const keyboardLayout = [
  '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
  'q w e r t y u i o p [ ] \\',
  "a s d f g h j k l ; ' {enter}",
  'z x c v b n m , . /',
  '@ {space}',
];

const inputTypesWhichNeedKeyboard = [
  'text',

  'email',

  'password',

  'number',

  'search',

  'tel',

  'url',
];

const convertThirdPartyKeyboardKeyToStandard = (key) => {
  switch (key) {
    case '{enter}':
      return 'Enter';

    case '{space}':
      return 'Space';

    case '{bksp}':
      return 'Backspace';

    default:
      return key;
  }
};

const isInputTypeWhichNeedKeyboard = (element) => element.matches('input') && inputTypesWhichNeedKeyboard.includes(element.getAttribute('type'));

const isElKeyboardTrigger = (element) => element.matches('textarea') || isInputTypeWhichNeedKeyboard(element);

const initializeThirdPartyKeyboard = (className, onKeyPress) => {
  try {
    return new Keyboard(className, {
      onKeyPress,

      layout: {
        default: keyboardLayout,
      },

      enableKeyNavigation: true,

      modules: [
        KeyNavigator,
      ],
    });
  } catch (e) {
    return null;
  }
};

const createGamepadVirtualKeyboardSupport = (client) => {
  const {
    document,

    addEventListener,

    removeEventListener,

    dispatchEvent,

    CustomEvent,
  } = client || {};

  const element = document.createElement('div');

  const { classList } = element;

  let activeDeferred = false;

  classList.add('virtual-keyboard');

  const holder = document.createElement('div');

  holder.classList.add('virtual-keyboard__holder');

  element.append(holder);

  let thirdPartyKeyboard = null;

  const possiblyDestroyThirdPartyKeyboard = () => {
    try {
      if (thirdPartyKeyboard) {
        thirdPartyKeyboard.destroy();
      }
    } catch (e) {
      //
    }
  };

  const isActive = () => classList.contains('virtual-keyboard--active');

  const deactivate = () => {
    if (!isActive()) {
      return;
    }

    classList.remove('virtual-keyboard--active');

    setTimeout(() => {
      activeDeferred = false;
    });

    possiblyDestroyThirdPartyKeyboard();
  };

  const onKeyPress = (key) => {
    const detail = convertThirdPartyKeyboardKeyToStandard(key);

    if (detail) {
      dispatchEvent(new CustomEvent('virtualkeyboardkeypress', { detail }));
    }

    if (detail === 'Enter') {
      deactivate();
    }
  };

  const activate = () => {
    if (isActive()) {
      return;
    }

    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(element)) {
      body.append(element);
    }

    classList.add('virtual-keyboard--active');

    setTimeout(() => {
      activeDeferred = true;
    });

    possiblyDestroyThirdPartyKeyboard();

    thirdPartyKeyboard = initializeThirdPartyKeyboard(
      'virtual-keyboard__holder',

      onKeyPress,
    );
  };

  const update = () => {
    const { activeElement } = document;

    if (isElKeyboardTrigger(activeElement)) {
      activate();

      return;
    }

    deactivate();
  };

  const buttonPressHandler = throttle(({ detail }) => {
    const isUp = hasButtonPressed(detail, 'dpadup');
    const isDown = hasButtonPressed(detail, 'dpaddown');
    const isRight = hasButtonPressed(detail, 'dpadright');
    const isLeft = hasButtonPressed(detail, 'dpadleft');

    const isA = hasButtonPressed(detail, 'a');

    const isButtonSupported = isUp || isDown || isRight || isLeft || isA;

    if (!isButtonSupported || !isActive() || !thirdPartyKeyboard) {
      return;
    }

    const { modules } = thirdPartyKeyboard;

    const { keyNavigation: KeyNavigatorModule } = modules || {};

    if (!KeyNavigatorModule) {
      return;
    }

    if (isUp) {
      KeyNavigatorModule.up();
    }

    if (isDown) {
      KeyNavigatorModule.down();
    }

    if (isRight) {
      KeyNavigatorModule.right();
    }

    if (isLeft) {
      KeyNavigatorModule.left();
    }

    if (isA) {
      KeyNavigatorModule.press();
    }
  }, INT_MS_THROTTLE_DELAY_LONG);

  addEventListener('gamepadbuttonpress', buttonPressHandler);

  addEventListener('focusin', update);

  addEventListener('focusout', update);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', buttonPressHandler);

    removeEventListener('focusin', update);

    removeEventListener('focusout', update);

    element.remove();

    possiblyDestroyThirdPartyKeyboard();
  };

  return {
    activate,

    deactivate,

    get active() {
      return isActive();
    },

    get activeDeferred() {
      return activeDeferred;
    },

    destroy,
  };
};

module.exports = createGamepadVirtualKeyboardSupport;
