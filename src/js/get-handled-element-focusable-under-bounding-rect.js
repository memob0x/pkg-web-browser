import getBoundingRectCenterPoint from './get-bounding-rect-center-point';
import queryPageFocusableHandledElementsGroups from './query-page-focusable-handled-elements-groups';
import getHandledElementUnderBoundingRect from './get-handled-element-under-bounding-rect';
import log from './log';

const getHandledElementFocusableUnderBoundingRect = async (page, boundingRect) => {
  const centerPoint = getBoundingRectCenterPoint(boundingRect);

  const focusableElementsGroups = await queryPageFocusableHandledElementsGroups(page);

  return focusableElementsGroups.reduce(async (formerValue, focusableElementsGroup) => {
    const formerValueResolved = await formerValue;

    const hasFormerValue = !!formerValueResolved;

    if (hasFormerValue) {
      return formerValue;
    }

    const { name, value } = focusableElementsGroup;

    const closestElement = await getHandledElementUnderBoundingRect(
      value,

      centerPoint,

      boundingRect,
    );

    if (closestElement) {
      log('log', name);

      return closestElement;
    }

    return formerValueResolved;
  }, Promise.resolve(null));
};

export default getHandledElementFocusableUnderBoundingRect;
