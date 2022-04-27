const triggerPageScroll = async (page, viewportWidth, viewportHeight, wheel) => {
  await page.mouse.move(
    viewportWidth / 2,

    viewportHeight / 2,
  );

  await page.mouse.wheel(wheel);
};

module.exports = triggerPageScroll;
