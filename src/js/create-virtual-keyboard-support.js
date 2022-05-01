const { default: Keyboard } = require('simple-keyboard');

const inputTypesWhichNeedKeyboard = [
  'text',

  'email',

  'password',

  'number',

  'search',

  'tel',

  'url',
];

const isInputTypeWhichNeedKeyboard = (element) => element.matches('input') && inputTypesWhichNeedKeyboard.includes(element.getAttribute('type'));

const isElKeyboardTrigger = (element) => element.matches('textarea') || isInputTypeWhichNeedKeyboard(element);

const isElOwnedBy = (element, owner) => owner === element || owner.contains(element);

const initializeThirdPartyKeyboard = (className) => {
  try {
    return new Keyboard(className, {

    });
  } catch (e) {
    return null;
  }
};

const createVirtualKeyboardSupport = (client) => {
  const {
    document,

    requestAnimationFrame,
  } = client || {};

  const element = document.createElement('div');

  const { classList } = element;

  let activeDeferred = false;

  classList.add('virtual-keyboard');

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

  const isElKeyboardPart = (e) => isElOwnedBy(e, element);

  const isActive = () => classList.contains('virtual-keyboard--active');

  const activate = () => {
    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(element)) {
      body.append(element);
    }

    possiblyDestroyThirdPartyKeyboard();

    thirdPartyKeyboard = initializeThirdPartyKeyboard('virtual-keyboard');

    classList.add('virtual-keyboard--active');

    setTimeout(() => {
      activeDeferred = true;
    });
  };

  const deactivate = () => {
    possiblyDestroyThirdPartyKeyboard();

    classList.remove('virtual-keyboard--active');

    setTimeout(() => {
      activeDeferred = false;
    });
  };

  const update = () => {
    const { activeElement } = document;

    const isAlreadyActive = isActive();

    const shouldBeActive = isElKeyboardPart(activeElement) || isElKeyboardTrigger(activeElement);

    if (!isAlreadyActive && shouldBeActive) {
      activate();

      return;
    }

    if (isAlreadyActive && !shouldBeActive) {
      deactivate();
    }
  };

  let hasBeenDestroyed = false;

  const loopIteration = () => {
    if (hasBeenDestroyed) {
      return;
    }

    update();

    requestAnimationFrame(loopIteration);
  };

  loopIteration();

  const destroy = () => {
    hasBeenDestroyed = true;

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

module.exports = createVirtualKeyboardSupport;
