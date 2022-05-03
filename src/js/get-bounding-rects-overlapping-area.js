const getBoundingRectsOverlappingArea = (boundingRectA, boundingRectB) => {
  const {
    top: topA = 0,

    left: leftA = 0,

    width: widthA = 0,

    height: heightA = 0,
  } = boundingRectA || {};

  const {
    left: leftB = 0,

    top: topB = 0,

    width: widthB = 0,

    height: heightB = 0,
  } = boundingRectB || {};

  const x = Math.max(
    0,

    Math.min(leftB + widthB, widthA + leftA) - Math.max(leftB, leftA),
  );

  const y = Math.max(
    0,

    Math.min(topB + heightB, topA + heightA) - Math.max(topB, topA),
  );

  return x * y;
};

export default getBoundingRectsOverlappingArea;
