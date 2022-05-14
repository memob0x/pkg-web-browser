const appendElementOnce = (doc, el) => {
  const { body } = doc;

  if (!body) {
    return false;
  }

  if (!body.contains(el)) {
    body.append(el);
  }

  return true;
};

export default appendElementOnce;
