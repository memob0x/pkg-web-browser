const getExcerpt = (string, chars = 20) => {
  const excerpt = string || '';

  // TODO: remove all line breaks

  const { length } = excerpt;

  if (length <= chars) {
    return excerpt;
  }

  return `${excerpt.slice(0, chars)}...`;
};

export default getExcerpt;
