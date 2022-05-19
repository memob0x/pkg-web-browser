import hasButtonPressed from './has-button-pressed';
import throttle from './throttle';

import { INT_MS_THROTTLE_DELAY } from '../constants';

const createDocumentModifier = (client) => {
  const {
    document,

    requestAnimationFrame,

    addEventListener,

    removeEventListener,
  } = client;

  let hasBeenDestroyed = false;

  const update = () => {
    [...document.querySelectorAll('a[target]')].forEach((x) => x.removeAttribute('target'));
  };

  const loopIteration = () => {
    if (hasBeenDestroyed) {
      return;
    }

    update();

    requestAnimationFrame(loopIteration);
  };

  loopIteration();

  const gamepadButtonPressHandler = throttle(({ detail }) => {
    const isX = hasButtonPressed(detail, 'x');

    const { activeElement } = document || {};

    if (!isX || !activeElement) {
      return;
    }

    activeElement.remove();
  }, INT_MS_THROTTLE_DELAY);

  addEventListener('gamepadbuttonpress', gamepadButtonPressHandler);

  const destroy = () => {
    removeEventListener('gamepadbuttonpress', gamepadButtonPressHandler);

    hasBeenDestroyed = true;
  };

  return {
    destroy,
  };
};

export default createDocumentModifier;
