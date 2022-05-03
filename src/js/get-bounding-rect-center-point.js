const getBoundingRectCenterPoint = (boundingRect) => {
  const {
    top = 0,

    left = 0,

    width = 0,

    height = 0,
  } = boundingRect || {};

  return [
    left + width / 2,

    top + height / 2,
  ];
};

export default getBoundingRectCenterPoint;
