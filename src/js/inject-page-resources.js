import throttle from './throttle';
import triggerPageKeyPress from './trigger-page-keypress';
import getHandledElementUnderBoundingRect from './get-handled-element-focusable-under-bounding-rect';
import hasButtonPressed from './has-button-pressed';
import log from './log';
import triggerPageNavigation from './trigger-page-navigation';
import getHandledElementPropValue from './get-handled-element-prop-value';
import queryPage from './query-page';
import triggerHandledElementMethod from './trigger-handled-element-method';
import getBoundingRectCenterPoint from './get-bounding-rect-center-point';
import triggerPageClose from './trigger-page-close';
import exposePageFunction from './expose-page-function';
import evaluatePageCode from './evaluate-page-code';

import { INT_MS_THROTTLE_DELAY_LONG, INT_MS_THROTTLE_DELAY_SHORT } from './constants';

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

  await exposePageFunction(page, 'gamepadButtonPressHandlerThrottleLong', throttle(async (detail, support) => {
    const { gamepadPointer, gamepadVirtualKeyboard } = support || {};

    const { activeDeferred: isActiveKeyboard } = gamepadVirtualKeyboard || {};

    if (isActiveKeyboard) {
      return;
    }

    const { activeDeferred: isActivePointer, boundingRect } = gamepadPointer || {};

    const [pointerX, pointerY] = getBoundingRectCenterPoint(boundingRect);

    const elementPointer = await getHandledElementUnderBoundingRect(page, boundingRect);
    const [elementActive] = await queryPage(page, '*:focus');

    let elementClickable = isActivePointer ? elementPointer : elementActive;
    elementClickable = elementClickable || elementPointer;

    const hasButtonPressedA = hasButtonPressed(detail, 'a');
    const hasButtonPressedAnalogLeft = hasButtonPressed(detail, 'analogleft');
    const hasButtonPressedAnalogRight = hasButtonPressed(detail, 'analogright');
    const hasButtonPressedAnalog = hasButtonPressedAnalogLeft || hasButtonPressedAnalogRight;
    const hasButtonPressedL1 = hasButtonPressed(detail, 'l1');
    const hasButtonPressedL2 = hasButtonPressed(detail, 'l2');
    const hasButtonPressedR1 = hasButtonPressed(detail, 'r1');
    const hasButtonPressedR2 = hasButtonPressed(detail, 'r2');
    const hasButtonPressedStart = hasButtonPressed(detail, 'start');
    const hasButtonPressedSelect = hasButtonPressed(detail, 'select');

    const elementClickableTag = await getHandledElementPropValue(elementClickable, 'tagName');

    const isElementClickable = !!elementClickableTag;
    const isElementClickableIframe = isElementClickable && elementClickableTag === 'IFRAME';

    log('log', '---------------------------------------------------------------');

    log('log', 'button press, clickable element tagName:', elementClickableTag);

    if (hasButtonPressedStart && hasButtonPressedSelect) {
      await triggerPageClose(page);

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (isActivePointer) {
      log('log', `mouse moved to ${pointerX} ${pointerY}`);

      await page.mouse.move(pointerX, pointerY);
    }

    if (hasButtonPressedA && isElementClickableIframe) {
      log('log', `button press: A, iframe navigation ${elementClickableTag}`);

      await page.goto(await getHandledElementPropValue(elementClickable, 'src'));

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedA && isElementClickable && !isActivePointer) {
      log('log', `button press: A, selection (enter key) on ${elementClickableTag}`);

      await triggerPageKeyPress(page, 'Enter');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedA && isElementClickable && isActivePointer) {
      log('log', `button press A, click ${elementClickableTag}`);

      await triggerHandledElementMethod(elementClickable, 'click');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedAnalog && isActivePointer && elementPointer) {
      log('log', `button press Analog, focus ${await getHandledElementPropValue(elementPointer, 'tagName')}`);

      await triggerHandledElementMethod(elementPointer, 'focus');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedL1 && hasButtonPressedL2 && hasButtonPressedR1 && hasButtonPressedR2) {
      log('log', 'button press l1+l2+r1+r2, page reload');

      await triggerPageNavigation(page, 0, true);

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedL1 && hasButtonPressedL2) {
      log('log', 'button press l1 + l2, history: go back');

      await triggerPageNavigation(page, -1, true);

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedR1 && hasButtonPressedR2) {
      log('log', 'button press r1 + r2, history: go forward');

      await triggerPageNavigation(page, 1, true);

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedR1) {
      log('log', 'button press r1, tab navigation: go right');

      await triggerPageKeyPress(page, 'Tab');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedL1) {
      log('log', 'button press l1, tab navigation: go back');

      await Promise.all([
        triggerPageKeyPress(page, 'Shift'),

        triggerPageKeyPress(page, 'Tab'),
      ]);

      log('log', '---------------------------------------------------------------');

      return;
    }

    log('log', 'button press not handled by gamepadButtonPressHandlerThrottleLong');
  }, INT_MS_THROTTLE_DELAY_LONG));

  await exposePageFunction(page, 'gamepadButtonPressHandlerThrottleShort', throttle(async (detail, support) => {
    const { gamepadVirtualKeyboard } = support || {};

    const { activeDeferred: isActiveKeyboard } = gamepadVirtualKeyboard || {};

    if (isActiveKeyboard) {
      return;
    }

    const hasButtonPressedDPadUp = hasButtonPressed(detail, 'dpadup');
    const hasButtonPressedDPadDown = hasButtonPressed(detail, 'dpaddown');
    const hasButtonPressedDPadLeft = hasButtonPressed(detail, 'dpadleft');
    const hasButtonPressedDPadRight = hasButtonPressed(detail, 'dpadright');

    if (hasButtonPressedDPadUp) {
      log('log', 'button press dpadup, arrow up');

      await triggerPageKeyPress(page, 'ArrowUp');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedDPadRight) {
      log('log', 'button press dpadright, arrow right');

      await triggerPageKeyPress(page, 'ArrowRight');

      log('log', '---------------------------------------------------------------');

      return;
    }
    if (hasButtonPressedDPadDown) {
      log('log', 'button press dpaddown, arrow down');

      await triggerPageKeyPress(page, 'ArrowDown');

      log('log', '---------------------------------------------------------------');

      return;
    }

    if (hasButtonPressedDPadLeft) {
      log('log', 'button press dpadleft, arrow left');

      await triggerPageKeyPress(page, 'ArrowLeft');

      log('log', '---------------------------------------------------------------');

      return;
    }

    log('log', 'button press not handled by gamepadButtonPressHandlerThrottleShort');
  }, INT_MS_THROTTLE_DELAY_SHORT));

  await exposePageFunction(page, 'virtualKeyboardKeypressHandler', async (detail) => {
    await triggerPageKeyPress(page, detail);
  });

  await evaluatePageCode(page, `
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandlerThrottleLong(detail, window.pkgBrowserGamepadRuntime);
    });
    
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandlerThrottleShort(detail, window.pkgBrowserGamepadRuntime);
    });

    window.addEventListener('virtualkeyboardkeypress', ({ detail }) => {
      window.virtualKeyboardKeypressHandler(detail, window.pkgBrowserGamepadRuntime);
    });
  `);
};

export default injectPageResources;
