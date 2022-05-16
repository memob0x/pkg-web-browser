const getExcerpt = (string, chars = 40) => {
  let excerpt = string || '';

  excerpt = excerpt.replace(/\n/g, ' ');

  const { length } = excerpt;

  if (length <= chars) {
    return excerpt;
  }

  return `${excerpt.slice(0, chars)}...`;
};

export default getExcerpt;
