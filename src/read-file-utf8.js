const { readFile } = require('fs/promises');

const readFileUtf8 = (x) => readFile(x, { encoding: 'utf8' });

module.exports = readFileUtf8;
