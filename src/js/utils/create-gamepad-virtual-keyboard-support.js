import Keyboard from 'simple-keyboard';
import KeyNavigator from 'simple-keyboard-key-navigation';
import hasButtonPressed from './has-button-pressed';
import throttle from './throttle';

import { INT_MS_THROTTLE_DELAY } from '../constants';
import appendElementOnce from './append-element-once';

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

const isInputTypeWhichNeedKeyboard = (element) => {
  if (!element.matches('input')) {
    return false;
  }

  const { type } = element || {};

  return inputTypesWhichNeedKeyboard.includes(type);
};

const isElKeyboardTrigger = (element) => element.matches('textarea') || isInputTypeWhichNeedKeyboard(element);

const initializeThirdPartyKeyboard = (className, onKeyPress) => {
  try {
    return new Keyboard(className, {
      onKeyPress,

      layout: {
        default: keyboardLayout,
      },

      useMouseEvents: true,

      preventMouseDownDefault: true,

      enableKeyNavigation: true,

      modules: [
        KeyNavigator,
      ],
    });
  } catch (e) {
    return null;
  }
};

const DIGIT_ANALOG_THRESHOLD = 0.35;

const DIGIT_ANALOG_THRESHOLD_NEGATIVE = DIGIT_ANALOG_THRESHOLD * -1;

const STRING_CSS_CLASS_NAME = 'gamepad-virtual-keyboard';

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

  classList.add(STRING_CSS_CLASS_NAME);

  const holder = document.createElement('div');

  holder.classList.add(`${STRING_CSS_CLASS_NAME}__holder`);

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

  const isActive = () => classList.contains(`${STRING_CSS_CLASS_NAME}--active`);

  const deactivate = () => {
    if (!isActive()) {
      return;
    }

    classList.remove(`${STRING_CSS_CLASS_NAME}--active`);

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
    if (isActive() || !appendElementOnce(document, element)) {
      return;
    }

    classList.add(`${STRING_CSS_CLASS_NAME}--active`);

    setTimeout(() => {
      activeDeferred = true;
    });

    possiblyDestroyThirdPartyKeyboard();

    thirdPartyKeyboard = initializeThirdPartyKeyboard(
      `${STRING_CSS_CLASS_NAME}__holder`,

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

    if (y < DIGIT_ANALOG_THRESHOLD_NEGATIVE) {
      ctrl.up();
    }

    if (y > DIGIT_ANALOG_THRESHOLD) {
      ctrl.down();
    }

    if (x < DIGIT_ANALOG_THRESHOLD_NEGATIVE) {
      ctrl.left();
    }

    if (x > DIGIT_ANALOG_THRESHOLD) {
      ctrl.right();
    }
  }, INT_MS_THROTTLE_DELAY);

  addEventListener('gamepadbuttonpress', buttonPressHandler);

  addEventListener('gamepadanalogmove', analogMoveHandler);

  // TODO: maybe support phisical keyboard too...

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
