const createGamepadFocusHighlighter = (client) => {
  const {
    document,

    requestAnimationFrame,

    addEventListener,

    removeEventListener,
  } = client;

  const highlighter = document.createElement('div');

  const { classList: highlighterCssClassList } = highlighter;

  highlighter.setAttribute('tabindex', '-1');

  highlighterCssClassList.add('gamepad-focus-highlighter');

  let hasBeenDestroyed = false;

  const update = () => {
    const { body } = document;

    if (!body) {
      return;
    }

    if (!body.contains(highlighter)) {
      body.append(highlighter);
    }

    const { documentElement, activeElement } = document;

    const { style } = documentElement;

    const {
      top,

      left,

      width,

      height,
    } = activeElement.getBoundingClientRect();

    style.setProperty('--gamepad-focus-highlighter-top', `${top}px`);
    style.setProperty('--gamepad-focus-highlighter-left', `${left}px`);
    style.setProperty('--gamepad-focus-highlighter-width', `${width}px`);
    style.setProperty('--gamepad-focus-highlighter-height', `${height}px`);
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

    removeEventListener('scroll', update);
    removeEventListener('resize', update);
  };

  return destroy;
};

module.exports = createGamepadFocusHighlighter;
