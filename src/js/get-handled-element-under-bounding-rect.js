const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point');
const getPointsDistance = require('./get-points-distance');
const getBoundingRectsOverlappingArea = require('./get-bounding-rects-overlapping-area');
const convertBoundingBoxToBoundingRect = require('./convert-bounding-box-to-bounding-rect');
const queryPageFocusableHandledElements = require('./query-page-focusable-handled-elements');
const getHandledElementBoundingBox = require('./get-handled-element-bounding-box');

const triggerHandledElementUnderBoundingRectHoverFocus = async (page, boundingRect) => {
  const centerPoint = getBoundingRectCenterPoint(boundingRect);

  const focusableElements = await queryPageFocusableHandledElements(page);

  const { element: closestElement } = await focusableElements.reduce(
    async (formerValue, element) => {
      const elementBoundingBox = await getHandledElementBoundingBox(element);

      const elementBoundingRect = convertBoundingBoxToBoundingRect(elementBoundingBox);

      const elementOverlappingArea = getBoundingRectsOverlappingArea(
        elementBoundingRect,

        boundingRect,
      );

      const elementCenterPoint = getBoundingRectCenterPoint(elementBoundingRect);

      const elementDistance = getPointsDistance(elementCenterPoint, centerPoint);

      const {
        overlappingArea: formerOverlappingArea,

        distance: formerDistance,
      } = await formerValue || {};

      const isElementMoreOverlapped = elementOverlappingArea > formerOverlappingArea;

      const isElementCloser = elementDistance < formerDistance;

      if (isElementMoreOverlapped && isElementCloser) {
        return {
          overlappingArea: elementOverlappingArea,

          distance: elementDistance,

          element,
        };
      }

      return formerValue;
    },

    Promise.resolve({
      overlappingArea: -Infinity,

      distance: Infinity,
    }),
  ) || {};

  return closestElement;
};

module.exports = triggerHandledElementUnderBoundingRectHoverFocus;
