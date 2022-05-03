import queryPage from './query-page';

const focusableClickableTags = [
  'a',

  'iframe',

  'button',

  'input',

  'textarea',

  '[role="button"]',
];

const focusableSelectorAll = focusableClickableTags.map((x) => `${x}:not([tabindex="-1"], [disabled])`);

const focusableSelectorDialog = focusableSelectorAll.map((x) => `[role="dialog"] ${x}`);

const queryElementsInNamedObj = async (page, selector, name) => ({
  name,

  value: await queryPage(page, selector),
});

const queryPageFocusableHandledElementsGroups = async (page) => Promise.all([
  queryElementsInNamedObj(page, `${focusableSelectorDialog}`, 'page:dialog'),

  queryElementsInNamedObj(page, `${focusableSelectorAll}`, 'page:main'),
]);

export default queryPageFocusableHandledElementsGroups;
