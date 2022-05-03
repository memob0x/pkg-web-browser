import Keyboard from 'simple-keyboard';
import KeyNavigator from 'simple-keyboard-key-navigation';
import hasButtonPressed from './has-button-pressed';
import throttle from './throttle';

import { INT_MS_THROTTLE_DELAY } from './constants';

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

  const getKeyboardController = () => {
    if (!thirdPartyKeyboard) {
      return null;
    }

    const { modules } = thirdPartyKeyboard;

    const { keyNavigation: KeyNavigatorModule } = modules || {};

    if (!KeyNavigatorModule) {
      return null;
    }

    return KeyNavigatorModule;
  };

  const buttonPressHandler = throttle(({ detail }) => {
    const isA = hasButtonPressed(detail, 'a');

    const ctrl = getKeyboardController();

    if (!isA || !ctrl || !isActive()) {
      deactivate();

      return;
    }

    ctrl.press();
  }, INT_MS_THROTTLE_DELAY);

  const analogMoveHandler = throttle(({ detail }) => {
    const ctrl = getKeyboardController();

    const { analog, name } = detail || {};

    if (name !== 'left' || !ctrl || !isActive()) {
      return;
    }

    const [x, y] = analog || [];

    const threshold = 0.5;

    if (y < threshold * -1) {
      ctrl.up();
    }

    if (y > threshold) {
      ctrl.down();
    }

    if (x < threshold * -1) {
      ctrl.left();
    }

    if (x > threshold) {
      ctrl.right();
    }
  }, INT_MS_THROTTLE_DELAY);

  addEventListener('gamepadbuttonpress', buttonPressHandler);

  addEventListener('gamepadanalogmove', analogMoveHandler);

  addEventListener('focusin', update);

  addEventListener('focusout', update);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', buttonPressHandler);

    removeEventListener('gamepadanalogmove', analogMoveHandler);

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

export default createGamepadVirtualKeyboardSupport;
