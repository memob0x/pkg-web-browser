const { readFile } = require('fs/promises');

const read = (x) => readFile(x, { encoding: 'utf8' });

module.exports = read;
