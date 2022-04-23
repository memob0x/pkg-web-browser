(({ addEventListener, document }) => {
  const { documentElement } = document;

  const scroll = (factor) => {
    documentElement.scrollTo({
      top: documentElement.scrollTop + 250 * factor,
      left: 0,
      behavior: 'smooth',
    });
  };

  addEventListener('gamepad:buttonpress:r2', () => scroll(1));

  addEventListener('gamepad:buttonpress:l2', () => scroll(-1));
})(globalThis);
