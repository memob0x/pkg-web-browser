const sass = require('node-sass');

const transpileScss = (data) => new Promise((resolve, reject) => {
  sass.render({
    data,

    outputStyle: 'compressed',
  }, (error, result) => {
    const { css } = result || {};

    if (!css || error) {
      reject(error || new Error('Invalid data provided to scss transpiler'));

      return;
    }

    resolve(css.toString());
  });
});

module.exports = transpileScss;
