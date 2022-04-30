const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point');
const getPointsDistance = require('./get-points-distance');
const getBoundingRectsOverlappingArea = require('./get-bounding-rects-overlapping-area');
const convertBoundingBoxToBoundingRect = require('./convert-bounding-box-to-bounding-rect');
const getHandledElementBoundingBox = require('./get-handled-element-bounding-box');
const log = require('./log');
const getHandledElementPropValue = require('./get-handled-element-prop-value');

const getHandledElementUnderBoundingRect = async (focusableElements, centerPoint, boundingRect) => {
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

      if (element && elementOverlappingArea > 0) {
        log('log', `overlapping element ${await getHandledElementPropValue(element, 'tagName')} [distance: ${elementDistance} | overlapping area: ${elementOverlappingArea}]`);
      }

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

module.exports = getHandledElementUnderBoundingRect;
