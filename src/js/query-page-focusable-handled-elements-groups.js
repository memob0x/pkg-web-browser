const focusableClickableTags = [
  'a',

  'button',

  'input',

  'textarea',

  '[role="button"]',
];

const focusableSelectorAll = focusableClickableTags.map((x) => `${x}:not([tabindex="-1"], [disabled])`);

const focusableSelectorTrapped = focusableSelectorAll.map((x) => `[tabindex="-1"]:not(${focusableClickableTags}) ${x}`);

const queryPageFocusableHandledElements = (page) => Promise.all([
  page.$$(`${focusableSelectorTrapped}`),

  page.$$(`${focusableSelectorAll}`),
]);

module.exports = queryPageFocusableHandledElements;
