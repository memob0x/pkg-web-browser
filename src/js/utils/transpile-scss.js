import { render } from 'node-sass';

const transpileScss = (file) => new Promise((resolve, reject) => {
  render({
    file,

    outputStyle: 'nested',
  }, (error, result) => {
    const { css } = result || {};

    if (!css || error) {
      reject(error || new Error('Invalid data provided to scss transpiler'));

      return;
    }

    resolve(css.toString());
  });
});

export default transpileScss;