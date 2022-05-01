const throttle = require('./throttle');
const triggerPageKeyPress = require('./trigger-page-keypress');
const getHandledElementUnderBoundingRect = require('./get-handled-element-focusable-under-bounding-rect');
const hasButtonPressed = require('./has-button-pressed');
const log = require('./log');
const triggerPageNavigation = require('./trigger-page-navigation');
const getHandledElementPropValue = require('./get-handled-element-prop-value');
const queryPage = require('./query-page');
const triggerHandledElementMethod = require('./trigger-handled-element-method');
const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point');
const triggerPageClose = require('./trigger-page-close');

const { INT_MS_THROTTLE_DELAY } = require('./constants');

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

  log('log', 'handler gamepadButtonPress: start');

  try {
    await page.exposeFunction('gamepadButtonPressHandler', throttle(async (detail, support) => {
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

      const hasButtonPressedDPadUp = hasButtonPressed(detail, 'dpadup');
      const hasButtonPressedDPadDown = hasButtonPressed(detail, 'dpaddown');
      const hasButtonPressedDPadLeft = hasButtonPressed(detail, 'dpadleft');
      const hasButtonPressedDPadRight = hasButtonPressed(detail, 'dpadright');

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

      log('log', 'button press not handled');
    }, INT_MS_THROTTLE_DELAY));

    log('log', 'handler gamepadButtonPress: ok');
  } catch (e) {
    log('log', 'handler gamepadButtonPress: ok, skip (handlers were already present)');
  }

  log('log', 'handler virtualKeyboardKeypress injection: start');

  try {
    await page.exposeFunction('virtualKeyboardKeypressHandler', async (detail) => {
      await triggerPageKeyPress(page, detail);
    });

    log('log', 'handler virtualKeyboardKeypress injection: ok');
  } catch (e) {
    log('log', 'handler virtualKeyboardKeypress injection: ok, skip (handler was already present)');
  }

  log('log', 'events injection: start');

  await page.evaluate(`
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandler(detail, window.pkgBrowserGamepadRuntime);
    });

    window.addEventListener('virtualkeyboardkeypress', ({ detail }) => {
      window.virtualKeyboardKeypressHandler(detail, window.pkgBrowserGamepadRuntime);
    });
  `);

  log('log', 'events injection: ok');
};

module.exports = injectPageResources;
