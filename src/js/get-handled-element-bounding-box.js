const getHandledElementBoundingBox = async (handledElement) => {
  if (!handledElement) {
    return null;
  }

  const bb = await handledElement.boundingBox();

  const { width, height } = bb || {};

  if (width + height) {
    return bb;
  }

  return getHandledElementBoundingBox(await handledElement.$('div'));
};

export default getHandledElementBoundingBox;
