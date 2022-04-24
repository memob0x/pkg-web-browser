const triggerHandledElementEvent = require('./trigger-handled-element-event');
const getHandledElementUnderBoundingRect = require('./get-handled-element-under-bounding-rect');

const triggerHandledElementUnderBoundingRectHoverFocus = async (page, boundingRect) => {
  const closestElement = getHandledElementUnderBoundingRect(page, boundingRect);

  return Promise.all([
    triggerHandledElementEvent(page, closestElement, 'hover'),

    triggerHandledElementEvent(page, closestElement, 'focus'),
  ]);
};

module.exports = triggerHandledElementUnderBoundingRectHoverFocus;
