const throttle = require('./throttle');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const getHandledElementUnderBoundingRect = require('./get-handled-element-focusable-under-bounding-rect');
const hasButtonPressed = require('./has-button-pressed');
const log = require('./log');
const triggerPageNavigation = require('./trigger-page-navigation');
const triggerPageScroll = require('./trigger-page-scroll');
const getHandledElementPropValue = require('./get-handled-element-prop-value');
const queryPage = require('./query-page');

const { INT_MS_THROTTLE_DELAY } = require('./constants');
const triggerHandledElementMethod = require('./trigger-handled-element-method');
const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point');

const INT_SCROLL_DELTA = 250;

const injectPageResources = async (page, options) => {
  const {
    width,

    height,

    css,

    js,
  } = options || {};

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

      const elementClickableTag = await getHandledElementPropValue(elementClickable, 'tagName');

      log('log', 'button press', elementClickableTag);

      if (isActivePointer) {
        log('log', `mouse moved to ${pointerX} ${pointerY}`);

        await page.mouse.move(pointerX, pointerY);
      }

      if (hasButtonPressedA && elementClickableTag === 'IFRAME') {
        log('log', `iframe navigation ${elementClickableTag}`);

        await page.goto(await getHandledElementPropValue(elementClickable, 'src'));

        return;
      }

      if (hasButtonPressedA && elementClickableTag) {
        log('log', `click ${elementClickableTag}`);

        await triggerHandledElementMethod(elementClickable, 'click');

        return;
      }

      if (hasButtonPressedAnalog && isActivePointer && elementPointer) {
        log('log', `focus ${await getHandledElementPropValue(elementPointer, 'tagName')}`);

        await triggerHandledElementMethod(elementPointer, 'focus');

        return;
      }

      if (hasButtonPressedL1 && hasButtonPressedL2 && hasButtonPressedR1 && hasButtonPressedR2) {
        log('log', 'page reload');

        await triggerPageNavigation(page, 0, true);

        return;
      }

      if (hasButtonPressedL1 && hasButtonPressedL2) {
        log('log', 'history: go back');

        await triggerPageNavigation(page, -1, true);

        return;
      }

      if (hasButtonPressedR1 && hasButtonPressedR2) {
        log('log', 'history: go forward');

        await triggerPageNavigation(page, 1, true);

        return;
      }

      if (hasButtonPressedR1) {
        log('log', 'tab navigation: go right');

        await triggerPageTabNavigation(page, false);

        return;
      }

      if (hasButtonPressedL1) {
        log('log', 'tab navigation: go back');

        await triggerPageTabNavigation(page, true);

        return;
      }

      if (hasButtonPressedR2) {
        log('log', 'scroll down');

        await triggerPageScroll(
          page,

          width,

          height,

          { deltaY: INT_SCROLL_DELTA },
        );

        return;
      }

      if (hasButtonPressedL2) {
        log('log', 'scroll top');

        await triggerPageScroll(
          page,

          width,

          height,

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
