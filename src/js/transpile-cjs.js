const readFileUtf8 = require('./read-file-utf8');

const regexr = /^module\.exports.*/gm;

const transpileCjs = async (file) => {
  const content = await readFileUtf8(file);

  return content.replace(regexr, '');
};

module.exports = transpileCjs;
