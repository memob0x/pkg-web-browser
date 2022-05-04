const getBoundingRectCenterPoint = require('./get-bounding-rect-center-point').default;
const getPointsDistance = require('./get-points-distance').default;
const getBoundingRectsOverlappingArea = require('./get-bounding-rects-overlapping-area').default;
const convertBoundingBoxToBoundingRect = require('./convert-bounding-box-to-bounding-rect').default;
const getHandledElementBoundingBox = require('./get-handled-element-bounding-box').default;
const log = require('./log').default;
const getHandledElementPropValue = require('./get-handled-element-prop-value').default;

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
        log('log', 'current element overlapping area:', elementOverlappingArea);
        log('log', 'current element distance:', elementDistance);

        log('log', 'former element overlapping area:', formerOverlappingArea);
        log('log', 'former element distance:', formerDistance);

        return {
          overlappingArea: elementOverlappingArea,

          distance: elementDistance,

          element,
        };
      }

      return formerValue;
    },

    Promise.resolve({
      overlappingArea: 0,

      distance: Infinity,
    }),
  ) || {};

  return closestElement;
};

module.exports = getHandledElementUnderBoundingRect;
