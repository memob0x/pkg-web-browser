const queryPage = require('./query-page');

const focusableClickableTags = [
  'a',

  'iframe',

  'button',

  'input',

  'textarea',

  '[role="button"]',
];

const focusableSelectorAll = focusableClickableTags.map((x) => `${x}:not([tabindex="-1"], [disabled])`);

const focusableSelectorTrapped = focusableSelectorAll.map((x) => `[tabindex="-1"]:not(${focusableClickableTags}) ${x}`);

const queryElementsInNamedObj = async (page, selector, name) => ({
  name,

  value: await queryPage(page, selector),
});

// eslint-disable-next-line arrow-body-style
const queryPageFocusableHandledElementsGroups = async (page) => {
  //  const frames = await page.mainFrame().childFrames();

  return Promise.all([
    // queryElementsInNamedObj(frames, `${focusableSelectorTrapped}`, 'iframe:focus-trap'),

    // queryElementsInNamedObj(frames, `${focusableSelectorAll}`, 'iframe:free'),

    queryElementsInNamedObj(page, `${focusableSelectorTrapped}`, 'page:focus-trap'),

    queryElementsInNamedObj(page, `${focusableSelectorAll}`, 'page:free'),
  ]);
};

module.exports = queryPageFocusableHandledElementsGroups;
