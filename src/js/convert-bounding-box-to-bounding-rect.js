const convertBoundingBoxToBoundingRect = (boundingBox) => {
  const { x = 0, y = 0 } = boundingBox || {};

  return {
    ...boundingBox,

    top: y,

    left: x,
  };
};

module.exports = convertBoundingBoxToBoundingRect;
