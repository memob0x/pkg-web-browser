const triggerPageTabNavigation = async (page, withShift) => {
  const { keyboard } = page;

  if (withShift) {
    await keyboard.down('Shift');
  }

  await keyboard.down('Tab');

  if (withShift) {
    await keyboard.up('Shift');
  }

  await keyboard.up('Tab');
};

module.exports = triggerPageTabNavigation;
