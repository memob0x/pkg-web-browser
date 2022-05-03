const getPointsDistance = (pointA, pointB) => {
  const [xa = 0, ya = 0] = pointA || [];

  const [xb = 0, yb = 0] = pointB || [];

  return Math.sqrt((xb - xa) ** 2 + (yb - ya) ** 2);
};

export default getPointsDistance;
