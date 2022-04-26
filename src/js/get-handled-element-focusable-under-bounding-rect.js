const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point');
const queryPageFocusableHandledElementsGroups = require('./query-page-focusable-handled-elements-groups');
const getHandledElementUnderBoundingRect = require('./get-handled-element-under-bounding-rect');
const log = require('./log');

const getHandledElementFocusableUnderBoundingRect = async (page, boundingRect) => {
  const centerPoint = getBoundingRectCenterPoint(boundingRect);

  const focusableElementsGroups = await queryPageFocusableHandledElementsGroups(page);

  return focusableElementsGroups.reduce(async (formerValue, focusableElementsGroup, index) => {
    const formerValueResolved = await formerValue;

    const hasFormerValue = !!formerValueResolved;

    if (hasFormerValue && index === 1) {
      log('log', 'in focus trap');
    }

    if (hasFormerValue) {
      return formerValue;
    }

    if (index === 1) {
      log('log', 'not in focus trap');
    }

    const closestElement = await getHandledElementUnderBoundingRect(
      focusableElementsGroup,

      centerPoint,

      boundingRect,
    );

    return closestElement || formerValueResolved;
  }, Promise.resolve(null));
};

module.exports = getHandledElementFocusableUnderBoundingRect;
