const sass = require('node-sass');

const transpileScss = (file) => new Promise((resolve, reject) => {
  sass.render({
    file,

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
