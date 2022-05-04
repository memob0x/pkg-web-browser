import throttle from './throttle';
import triggerPageKeyPress from './trigger-page-keypress';
import getHandledElementUnderBoundingRect from './get-handled-element-focusable-under-bounding-rect';
import hasButtonPressed from './has-button-pressed';
import log from './log';
import triggerPageNavigation from './trigger-page-navigation';
import getHandledElementPropValue from './get-handled-element-prop-value';
import queryPage from './query-page';
import triggerHandledElementMethod from './trigger-handled-element-method';
import triggerPageClose from './trigger-page-close';
import exposePageFunction from './expose-page-function';
import evaluatePageCode from './evaluate-page-code';

import { INT_MS_THROTTLE_DELAY } from '../constants';

const injectPageResources = async (page, options) => {
  const {
    css,

    js,
  } = options || {};

  log('log', 'files injection: start');

  await Promise.all([
    page.addStyleTag({ content: css }),

    page.addScriptTag({ content: js }),
  ]);

  log('log', 'files injection: ok');

  await exposePageFunction(page, 'gamepadButtonPressHandler', throttle(async (detail, support) => {
    log('log', 'gamepadButtonPressHandler');

    const { gamepadPointer, gamepadVirtualKeyboard } = support || {};

    const { activeDeferred: isActiveKeyboard } = gamepadVirtualKeyboard || {};

    const { activeDeferred: isActivePointer, boundingRect } = gamepadPointer || {};

    const elementPointer = await getHandledElementUnderBoundingRect(page, boundingRect);
    const [elementActive] = await queryPage(page, '*:focus');

    let elementClickable = isActivePointer ? elementPointer : elementActive;
    elementClickable = elementClickable || elementPointer;

    const hasButtonPressedA = hasButtonPressed(detail, 'a');
    const hasButtonPressedL1 = hasButtonPressed(detail, 'l1');
    const hasButtonPressedL2 = hasButtonPressed(detail, 'l2');
    const hasButtonPressedR1 = hasButtonPressed(detail, 'r1');
    const hasButtonPressedR2 = hasButtonPressed(detail, 'r2');
    const hasButtonPressedStart = hasButtonPressed(detail, 'start');
    const hasButtonPressedSelect = hasButtonPressed(detail, 'select');

    const elementClickableTag = await getHandledElementPropValue(elementClickable, 'tagName');

    const isElementClickable = !!elementClickableTag;
    const isElementClickableIframe = isElementClickable && elementClickableTag === 'IFRAME';

    if (hasButtonPressedStart && hasButtonPressedSelect) {
      await triggerPageClose(page);

      return;
    }

    if (!isActiveKeyboard && hasButtonPressedA && isElementClickableIframe) {
      log('log', `button press: A, iframe navigation ${elementClickableTag}`);

      await page.goto(await getHandledElementPropValue(elementClickable, 'src'));

      return;
    }

    if (!isActiveKeyboard && !isActivePointer && hasButtonPressedA && isElementClickable) {
      log('log', `button press: A, selection (enter key) on ${elementClickableTag}`);

      await triggerPageKeyPress(page, 'Enter');

      return;
    }

    if (!isActiveKeyboard && isActivePointer && hasButtonPressedA && isElementClickable) {
      log('log', `button press A, click ${elementClickableTag}`);

      await triggerHandledElementMethod(elementClickable, 'focus');

      return;
    }

    if (hasButtonPressedL1 && hasButtonPressedL2 && hasButtonPressedR1 && hasButtonPressedR2) {
      log('log', 'button press l1+l2+r1+r2, page reload');

      await triggerPageNavigation(page, 0, true);

      return;
    }

    if (hasButtonPressedL1 && hasButtonPressedL2) {
      log('log', 'button press l1 + l2, history: go back');

      await triggerPageNavigation(page, -1, true);

      return;
    }

    if (hasButtonPressedR1 && hasButtonPressedR2) {
      log('log', 'button press r1 + r2, history: go forward');

      await triggerPageNavigation(page, 1, true);

      return;
    }

    if (hasButtonPressedR1) {
      log('log', 'button press r1, tab navigation: go right');

      await triggerPageKeyPress(page, 'Tab');

      return;
    }

    if (hasButtonPressedL1) {
      log('log', 'button press l1, tab navigation: go back');

      await Promise.all([
        triggerPageKeyPress(page, 'Shift'),

        triggerPageKeyPress(page, 'Tab'),
      ]);

      return;
    }

    const hasButtonPressedDPadUp = hasButtonPressed(detail, 'dpadup');
    const hasButtonPressedDPadDown = hasButtonPressed(detail, 'dpaddown');
    const hasButtonPressedDPadLeft = hasButtonPressed(detail, 'dpadleft');
    const hasButtonPressedDPadRight = hasButtonPressed(detail, 'dpadright');

    if (hasButtonPressedDPadUp) {
      log('log', 'button press dpadup, arrow up');

      await triggerPageKeyPress(page, 'ArrowUp');

      return;
    }

    if (hasButtonPressedDPadRight) {
      log('log', 'button press dpadright, arrow right');

      await triggerPageKeyPress(page, 'ArrowRight');

      return;
    }

    if (hasButtonPressedDPadDown) {
      log('log', 'button press dpaddown, arrow down');

      await triggerPageKeyPress(page, 'ArrowDown');

      return;
    }

    if (hasButtonPressedDPadLeft) {
      log('log', 'button press dpadleft, arrow left');

      await triggerPageKeyPress(page, 'ArrowLeft');

      return;
    }

    log('log', 'button press not handled by gamepadButtonPressHandler');
  }, INT_MS_THROTTLE_DELAY));

  await exposePageFunction(page, 'virtualKeyboardKeypressHandler', async (detail) => {
    await triggerPageKeyPress(page, detail);
  });

  await evaluatePageCode(page, `
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandler(detail, window.browserGamepadSupport);
    });

    window.addEventListener('virtualkeyboardkeypress', ({ detail }) => {
      window.virtualKeyboardKeypressHandler(detail, window.browserGamepadSupport);
    });
  `);
};

export default injectPageResources;
