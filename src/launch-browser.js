const puppeteer = require('puppeteer');

const readFileUtf8 = require('./read-file-utf8');

const getBoundingRectCenterPoint = (boundingRect) => {
  const {
    top = 0,

    left = 0,

    width = 0,

    height = 0,
  } = boundingRect || {};

  return [
    left + width / 2,
    top + height / 2,
  ];
};

const queryFocusableElements = async (p) => {
  const focusableTags = ['a', 'button', 'input', 'textarea'];

  const focusableSelector = focusableTags.map((x) => `${x}:not([tabindex="-1"]`).concat(`[role="button"]:not(${focusableTags})`);

  const focusableElementsTrapped = await p.$$(`${focusableSelector.map((x) => `[tabindex="-1"] > ${x}`)}`);

  const hasFocusTrap = !!focusableElementsTrapped.length;

  return hasFocusTrap ? focusableElementsTrapped : p.$$(`${focusableSelector}`);
};

const getPointDistance = (pointA, pointB) => {
  const [xa = 0, ya = 0] = pointA || [];
  const [xb = 0, yb = 0] = pointB || [];

  return Math.sqrt((xb - xa) ** 2 + (yb - ya) ** 2);
};

const getOverlappingArea = (boundingRectA, boundingRectB) => {
  const {
    top: topA = 0,

    left: leftA = 0,

    width: widthA = 0,

    height: heightA = 0,
  } = boundingRectA || {};

  const {
    left: leftB = 0,

    top: topB = 0,

    width: widthB = 0,

    height: heightB = 0,
  } = boundingRectB || {};

  const x = Math.max(
    0,

    Math.min(leftB + widthB, widthA + leftA) - Math.max(leftB, leftA),
  );

  const y = Math.max(
    0,

    Math.min(topB + heightB, topA + heightA) - Math.max(topB, topA),
  );

  return x * y;
};

const convertBoundingBoxToBoundingRect = (boundingBox) => {
  const { x = 0, y = 0 } = boundingBox || {};

  return {
    ...boundingBox,

    top: y,

    left: x,
  };
};

const getHandledElementBoundingBox = async (el) => {
  if (!el) {
    return null;
  }

  const bb = await el.boundingBox();

  const { width, height } = bb || {};

  if (width + height) {
    return bb;
  }

  return getHandledElementBoundingBox(await el.$('div'));
};

const trigger = async (page, subject, type) => {
  const el = typeof subject === 'string' ? await page.$(subject) : subject;

  if (!el) {
    return null;
  }

  return el[type]();
};

const triggerHandledElementUnderBoundingRectHoverFocus = async (page, boundingRect) => {
  const centerPoint = getBoundingRectCenterPoint(boundingRect);

  const focusableElements = await queryFocusableElements(page);

  const { element: closestElement } = await focusableElements.reduce(
    async (formerValue, element) => {
      const elementBoundingBox = await getHandledElementBoundingBox(element);

      const elementBoundingRect = convertBoundingBoxToBoundingRect(elementBoundingBox);

      const elementOverlappingArea = getOverlappingArea(elementBoundingRect, boundingRect);

      const elementCenterPoint = getBoundingRectCenterPoint(elementBoundingRect);

      const elementDistance = getPointDistance(elementCenterPoint, centerPoint);

      const {
        overlappingArea: formerOverlappingArea,

        distance: formerDistance,
      } = await formerValue || {};

      const isElementMoreOverlapped = elementOverlappingArea > formerOverlappingArea;

      const isElementCloser = elementDistance < formerDistance;

      if (isElementMoreOverlapped && isElementCloser) {
        return {
          overlappingArea: elementOverlappingArea,

          distance: elementDistance,

          element,
        };
      }

      return formerValue;
    },

    Promise.resolve({
      overlappingArea: -Infinity,

      distance: Infinity,
    }),
  ) || {};

  return Promise.all([
    trigger(page, closestElement, 'hover'),

    trigger(page, closestElement, 'focus'),
  ]);
};

const throttle = (fn, ms) => {
  let timeout = null;

  return (...args) => {
    if (timeout !== null) {
      return;
    }

    timeout = setTimeout(() => {
      timeout = null;
    }, ms);

    fn(...args);
  };
};

const readAndConcatFiles = (paths) => paths.reduce(
  async (bundle, path) => await bundle + await readFileUtf8(path),

  Promise.resolve(''),
);

const triggerTab = async (page, shift) => {
  if (shift) {
    await page.keyboard.down('Shift');
  }

  await page.keyboard.down('Tab');

  if (shift) {
    await page.keyboard.up('Shift');
  }

  await page.keyboard.up('Tab');
};

const launchBrowser = async (
  url,

  viewportWidth,

  viewportHeight,

  executablePath,

  userDataDir,

  shouldOpenInKiosk,
) => {
  const [contentToBeInjectedCss, contentToBeInjectedJs] = await Promise.all([
    readAndConcatFiles([
      `${__dirname}/gamepad-pointer.css`,
    ]),

    readAndConcatFiles([
      `${__dirname}/gamepad.js`,

      `${__dirname}/gamepad-pointer.js`,

      `${__dirname}/gamepad-scroller.js`,
    ]),
  ]);

  const args = [
    `--app=${url}`,

    '--new-window',
  ];

  if (shouldOpenInKiosk) {
    args.push('--kiosk');
  }

  const browser = await puppeteer.launch({
    headless: false,

    userDataDir,

    executablePath,

    ignoreDefaultArgs: [
      '--enable-automation',
    ],

    args,
  });

  const [page] = await browser.pages();

  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  await page.waitForNavigation({ waitUntil: 'load' });

  // TODO: check, maybe replace polling with a cleaner approach in order to support live reloads
  const pollInjection = async () => {
    try {
      if (!await page.evaluate('window.______hasPuppeteerInjectedResources')) {
        await Promise.all([
          page.evaluate('window.______hasPuppeteerInjectedResources = true'),

          page.addStyleTag({ content: contentToBeInjectedCss }),

          page.addScriptTag({ content: contentToBeInjectedJs }),

          page.exposeFunction('______triggerTab', throttle((shift) => triggerTab(page, shift), 250)),

          page.exposeFunction('______triggerHandledActiveElementClick', throttle(() => trigger(page, '*:focus', 'click'), 250)),

          page.exposeFunction('______triggerHandledElementUnderBoundingRectHoverFocus', throttle((boundingRect) => triggerHandledElementUnderBoundingRectHoverFocus(page, boundingRect), 250)),

          page.evaluate(`
            addEventListener('gamepad:pointer:selection', ({ detail }) => ______triggerHandledElementUnderBoundingRectHoverFocus(detail));
            
            addEventListener('gamepad:buttonpress:abxy', () => ______triggerHandledActiveElementClick());
            
            addEventListener('gamepad:buttonpress:r1', () => ______triggerTab(false));
            
            addEventListener('gamepad:buttonpress:l1', () => ______triggerTab(true));
          `),
        ]);
      }
    } catch (e) {
    //
    }

    await pollInjection();
  };

  await pollInjection();
};

module.exports = launchBrowser;
