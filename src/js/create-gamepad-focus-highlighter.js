const createGamepadFocusHighlighter = (client) => {
  const {
    document,

    requestAnimationFrame,

    addEventListener,

    removeEventListener,
  } = client;

  const element = document.createElement('div');

  const { classList } = element;

  classList.add('gamepad-focus-highlighter');

  let hasBeenDestroyed = false;

  const update = () => {
    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(element)) {
      body.append(element);
    }

    const { documentElement, activeElement } = document;

    const { style } = documentElement;

    const {
      top: activeElementTop,

      left: activeElementLeft,

      width: activeElementWidth,

      height: activeElementHeight,
    } = activeElement.getBoundingClientRect();

    style.setProperty('--gamepad-focus-highlighter-top', `${activeElementTop}px`);
    style.setProperty('--gamepad-focus-highlighter-left', `${activeElementLeft}px`);
    style.setProperty('--gamepad-focus-highlighter-width', `${activeElementWidth}px`);
    style.setProperty('--gamepad-focus-highlighter-height', `${activeElementHeight}px`);

    const {
      top: bodyTop,

      left: bodyLeft,

      width: bodyWidth,

      height: bodyHeight,
    } = body.getBoundingClientRect();

    const isFullScreen = activeElementTop === bodyTop
      && activeElementLeft === bodyLeft
      && activeElementWidth === bodyWidth
      && activeElementHeight === bodyHeight;

    classList[isFullScreen ? 'add' : 'remove']('gamepad-focus-highlighter--full-screen');
    classList[isFullScreen ? 'remove' : 'add']('gamepad-focus-highlighter--not-full-screen');
  };

  const loopIteration = () => {
    if (hasBeenDestroyed) {
      return;
    }

    update();

    requestAnimationFrame(loopIteration);
  };

  loopIteration();

  addEventListener('scroll', update);
  addEventListener('resize', update);

  const destroy = () => {
    hasBeenDestroyed = true;

    element.remove();

    removeEventListener('scroll', update);
    removeEventListener('resize', update);
  };

  return destroy;
};

export default createGamepadFocusHighlighter;
