const queryPageFocusableHandledElements = async (page) => {
  const focusableTags = ['a', 'button', 'input', 'textarea'];

  const focusableSelector = focusableTags.map((x) => `${x}:not([tabindex="-1"]`).concat(`[role="button"]:not(${focusableTags})`);

  const focusableElementsTrapped = await page.$$(`${focusableSelector.map((x) => `[tabindex="-1"] > ${x}`)}`);

  const hasFocusTrap = !!focusableElementsTrapped.length;

  return hasFocusTrap ? focusableElementsTrapped : page.$$(`${focusableSelector}`);
};

module.exports = queryPageFocusableHandledElements;
