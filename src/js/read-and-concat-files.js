const readFileUtf8 = require('./read-file-utf8');

const readAndConcatFiles = (paths) => paths.reduce(
  async (bundle, path) => await bundle + await readFileUtf8(path),

  Promise.resolve(''),
);

module.exports = readAndConcatFiles;
