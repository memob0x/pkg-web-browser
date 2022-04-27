const throttle = require('./throttle');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const getHandledElementUnderBoundingRect = require('./get-handled-element-focusable-under-bounding-rect');
const hasButtonPressed = require('./has-button-pressed');
const log = require('./log');
const triggerPageNavigation = require('./trigger-page-navigation');
const setPageInjectionFlag = require('./set-page-injection-flag');
const triggerPageScroll = require('./trigger-page-scroll');
const getHandledElementPropValue = require('./get-handled-element-prop-value');
const queryPage = require('./query-page');

const { INT_MS_THROTTLE_DELAY } = require('./constants');
const triggerHandledElementMethod = require('./trigger-handled-element-method');

const INT_SCROLL_DELTA = 250;

const injectPageResources = async (page, viewportWidth, viewportHeight, css, js) => {
  log('log', '0');

  await setPageInjectionFlag(page, true);

  log('log', '1');

  await Promise.all([
    page.addStyleTag({ content: css }),

    page.addScriptTag({ content: js }),
  ]);

  log('log', '2');

  try {
    await page.exposeFunction('gamepadButtonPressHandler', throttle(async (detail, support) => {
      const { gamepadPointer } = support || {};

      const { activeDeferred: isActivePointer, boundingRect } = gamepadPointer || {};

      const closestElement = await getHandledElementUnderBoundingRect(page, boundingRect);

      const hasButtonPressedA = hasButtonPressed(detail, 'a');

      if (hasButtonPressedA) {
        const [element] = await queryPage(page, '*:focus');

        if (!element) {
          log('log', '"a" pressed but nothing is focused');

          return;
        }

        log('log', `"a" pressed on focused element tagName: ${await getHandledElementPropValue(element, 'tagName')}`);

        await triggerHandledElementMethod(element, 'click');

        return;
      }

      const hasButtonPressedAnalogLeft = hasButtonPressed(detail, 'analogleft');
      const hasButtonPressedAnalogRight = hasButtonPressed(detail, 'analogright');

      const hasButtonPressedAnalog = hasButtonPressedAnalogLeft || hasButtonPressedAnalogRight;

      if (hasButtonPressedAnalog && isActivePointer && closestElement) {
        log('log', `focusing ${await getHandledElementPropValue(closestElement, 'tagName')}`);

        await triggerHandledElementMethod(closestElement, 'focus');

        return;
      }

      const hasButtonPressedL1 = hasButtonPressed(detail, 'l1');
      const hasButtonPressedL2 = hasButtonPressed(detail, 'l2');
      const hasButtonPressedR1 = hasButtonPressed(detail, 'r1');
      const hasButtonPressedR2 = hasButtonPressed(detail, 'r2');

      if (
        hasButtonPressedL1 && hasButtonPressedL2 && hasButtonPressedR1 && hasButtonPressedR2
      ) {
        await triggerPageNavigation(page, 0, true);

        return;
      }

      if (hasButtonPressedL1 && hasButtonPressedL2) {
        await triggerPageNavigation(page, -1, true);

        return;
      }

      if (hasButtonPressedR1 && hasButtonPressedR2) {
        await triggerPageNavigation(page, 1, true);

        return;
      }

      if (hasButtonPressedR1) {
        await triggerPageTabNavigation(page, false);

        return;
      }

      if (hasButtonPressedL1) {
        await triggerPageTabNavigation(page, true);

        return;
      }

      if (hasButtonPressedR2) {
        await triggerPageScroll(
          page,

          viewportWidth,

          viewportHeight,

          { deltaY: INT_SCROLL_DELTA },
        );

        return;
      }

      if (hasButtonPressedL2) {
        await triggerPageScroll(
          page,

          viewportWidth,

          viewportHeight,

          { deltaY: -INT_SCROLL_DELTA },
        );
      }
    }, INT_MS_THROTTLE_DELAY));

    log('log', '3');
  } catch (e) {
    log('log', 'exposed function were already present');
  }

  await page.evaluate(`    
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandler(detail, window.pkgBrowserGamepadRuntime);
    }); 
  `);

  log('log', '4');
};

module.exports = injectPageResources;
