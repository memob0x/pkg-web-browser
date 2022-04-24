const throttle = require('./throttle');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const triggerHandledElementEvent = require('./trigger-handled-element-event');
const triggerHandledElementUnderBoundingRectHoverFocus = require('./trigger-handled-element-under-bounding-rect-hover-focus');

const {
  INT_MS_THROTTLE_DELAY,

  STRING_INJECTED_FLAG_NAME,
} = require('./constants');

const injectPageResources = (page, css, js) => Promise.all([
  page.evaluate(`window.${STRING_INJECTED_FLAG_NAME} = true;`),

  page.addStyleTag({ content: css }),

  page.addScriptTag({ content: js }),

  page.exposeFunction('triggerTab', throttle(
    (shift) => triggerPageTabNavigation(page, shift),

    INT_MS_THROTTLE_DELAY,
  )),

  page.exposeFunction('triggerHandledActiveElementClick', throttle(
    () => triggerHandledElementEvent(page, '*:focus', 'click'),

    INT_MS_THROTTLE_DELAY,
  )),

  page.exposeFunction('triggerHandledElementUnderBoundingRectHoverFocus', throttle(
    (boundingRect) => triggerHandledElementUnderBoundingRectHoverFocus(page, boundingRect),

    INT_MS_THROTTLE_DELAY,
  )),

  page.evaluate(`
    addEventListener('gamepad:pointer:selection', ({ detail }) => triggerHandledElementUnderBoundingRectHoverFocus(detail));
    
    addEventListener('gamepad:buttonpress:abxy', () => triggerHandledActiveElementClick());
    
    addEventListener('gamepad:buttonpress:r1', () => triggerTab(false));
    
    addEventListener('gamepad:buttonpress:l1', () => triggerTab(true));
  `),
]);

module.exports = injectPageResources;
