const throttle = require('./throttle');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const getHandledElementUnderBoundingRect = require('./get-handled-element-under-bounding-rect');
const hasButtonPressed = require('./has-button-pressed');
const setPageInjectionFlag = require('./set-page-injection-flag');
//  triggerPageNavigation = require('./trigger-page-navigation');

const {
  INT_MS_THROTTLE_DELAY,
} = require('./constants');

const injectPageResources = async (page, css, js) => {
  await Promise.all([
    page.addStyleTag({ content: css }),

    page.addScriptTag({ content: js }),
  ]);

  await Promise.all([
    page.exposeFunction('gamepadButtonPressHandler', throttle(async (detail) => {
      const hasButtonPressedA = hasButtonPressed(detail, 'a');

      if (hasButtonPressedA) {
        const element = await page.$('*:focus');

        if (element) {
          await element.click();
        }

        return;
      }

      const hasButtonPressedL1 = hasButtonPressed(detail, 'l1');
      // const hasButtonPressedL2 = hasButtonPressed(detail, 'l2');
      const hasButtonPressedR1 = hasButtonPressed(detail, 'r1');
      // const hasButtonPressedR2 = hasButtonPressed(detail, 'r2');

      /* if (hasButtonPressedL1 && hasButtonPressedL2 && hasButtonPressedR1 && hasButtonPressedR2) {
        await triggerPageNavigation(page);

        return;
      }

      if (hasButtonPressedL1 && hasButtonPressedL2) {
        await triggerPageNavigation(page, -1);

        return;
      }

      if (hasButtonPressedR1 && hasButtonPressedR2) {
        await triggerPageNavigation(page, 1);

        return;
      } */

      if (hasButtonPressedR1) {
        await triggerPageTabNavigation(page, false);

        return;
      }

      if (hasButtonPressedL1) {
        await triggerPageTabNavigation(page, true);
      }
    }, INT_MS_THROTTLE_DELAY)),

    page.exposeFunction('gamepadPointerSelectionHandler', throttle(async (detail) => {
      const closestElement = await getHandledElementUnderBoundingRect(page, detail);

      if (closestElement) {
        await closestElement.focus();
      }
    }, INT_MS_THROTTLE_DELAY)),
  ]);

  await page.evaluate(`
    window.addEventListener('gamepadpointerselection', ({ detail }) => window.gamepadPointerSelectionHandler(detail));
    
    window.addEventListener('gamepadbuttonpress', ({ detail }) => {
      window.gamepadButtonPressHandler(JSON.parse(JSON.stringify(detail)));
    }); 
  `);

  await setPageInjectionFlag(page, true);
};

module.exports = injectPageResources;
