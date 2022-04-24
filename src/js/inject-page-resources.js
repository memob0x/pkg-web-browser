const { resolve } = require('path');
const transpileScss = require('./transpile-scss');
const throttle = require('./throttle');
const readAndConcatFiles = require('./read-and-concat-files');
const triggerPageTabNavigation = require('./trigger-page-tab-navigation');
const triggerHandledElementEvent = require('./trigger-handled-element-event');
const triggerHandledElementUnderBoundingRectHoverFocus = require('./trigger-handled-element-under-bounding-rect-hover-focus');
const createGamepadSupport = require('./create-gamepad-support');
const createGamepadPointer = require('./create-gamepad-pointer');
const createGamepadScroller = require('./create-gamepad-scroller');

const {
  INT_MS_THROTTLE_DELAY,

  STRING_INJECTED_FLAG_NAME,
} = require('./constants');

const injectPageResources = async (page) => {
  const [contentToBeInjectedScss, contentToBeInjectedJs] = await Promise.all([
    readAndConcatFiles([
      resolve(__dirname, '..', 'gamepad-pointer.scss'),
    ]),
  ]);

  const contentToBeInjectedCss = await transpileScss(contentToBeInjectedScss);

  return Promise.all([
    page.evaluate(`${STRING_INJECTED_FLAG_NAME} = true`),

    page.addStyleTag({ content: contentToBeInjectedCss }),

    page.addScriptTag({ content: contentToBeInjectedJs }),

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

    page.exposeFunction('createGamepadSupport', () => createGamepadSupport()),

    page.exposeFunction('createGamepadPointer', () => createGamepadPointer()),

    page.exposeFunction('createGamepadScroller', () => createGamepadScroller()),

    page.evaluate(`
      createGamepadSupport();
      
      createGamepadPointer();

      createGamepadScroller();

      addEventListener('gamepad:pointer:selection', ({ detail }) => triggerHandledElementUnderBoundingRectHoverFocus(detail));
      
      addEventListener('gamepad:buttonpress:abxy', () => triggerHandledActiveElementClick());
      
      addEventListener('gamepad:buttonpress:r1', () => triggerTab(false));
      
      addEventListener('gamepad:buttonpress:l1', () => triggerTab(true));
    `),
  ]);
};

module.exports = injectPageResources;
