const getHandledElementPropValue = async (handledElement, propName) => {
  if (!handledElement) {
    return '';
  }

  const handledProp = await handledElement.getProperty(propName);

  return handledProp.jsonValue();
};

export default getHandledElementPropValue;
