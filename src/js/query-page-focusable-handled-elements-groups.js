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

// FIXME: since "focus-trap" can be implemented in differend ways
// we need to find a better way to achieve the preferred focused elements,
// ideally the best way should detect which elements "visually" focusable
// by detecting which layer is above the others, which is display: none etc...
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

export default queryPageFocusableHandledElementsGroups;
