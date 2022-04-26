const throttle = require('./throttle');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const getHandledElementUnderBoundingRect = require('./get-handled-element-focusable-under-bounding-rect');
const hasButtonPressed = require('./has-button-pressed');
const log = require('./log');
const triggerPageNavigation = require('./trigger-page-navigation');

const {
  INT_MS_THROTTLE_DELAY,
} = require('./constants');
const setPageInjectionFlag = require('./set-page-injection-flag');

const injectPageResources = async (page, css, js) => {
  log('log', '0');

  await setPageInjectionFlag(page, true);

  log('log', '1');

  await Promise.all([
    page.addStyleTag({ content: css }),

    page.addScriptTag({ content: js }),
  ]);

  log('log', '2');

  try {
    await Promise.all([
      page.exposeFunction('gamepadButtonPressHandler', throttle(async (detail) => {
        log('log', 'gamepadButtonPressHandler');

        const hasButtonPressedA = hasButtonPressed(detail, 'a');

        if (hasButtonPressedA) {
          const element = await page.$('*:focus');

          if (element) {
            await element.click();
          }

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
        }
      }, INT_MS_THROTTLE_DELAY)),

      page.exposeFunction('gamepadPointerSelectionHandler', throttle(async (detail) => {
        log('log', 'gamepadPointerSelectionHandler');

        const closestElement = await getHandledElementUnderBoundingRect(page, detail);

        if (closestElement) {
          await closestElement.focus();
        }
      }, INT_MS_THROTTLE_DELAY)),
    ]);

    log('log', '3');
  } catch (e) {
    log('log', 'exposed function were already present');
  }

  await page.evaluate(`
    window.addEventListener('gamepadpointerselection', ({ detail }) => window.gamepadPointerSelectionHandler(detail));
    
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandler(JSON.parse(JSON.stringify(detail)));
    }); 
  `);

  log('log', '4');
};

module.exports = injectPageResources;
