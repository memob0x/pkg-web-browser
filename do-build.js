const { exec } = require('pkg');

const { writeFile } = require('fs/promises');

const {
  url,

  width,

  height,

  browser,

  data,

  target,

  output,
} = require('./arguments');

(async () => {
  try {
    await writeFile(`${__dirname}/runtime.json`, JSON.stringify({
      url,

      width,

      height,

      browser,

      data,

      target,

      output,
    }));

    await exec([
      'runtime.js',
      '--config',
      'config.json',
      '--compress',
      'GZip',
      '--no-native-build',
      '--target',
      target,
      '--output',
      output,
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } // finally {
  // await unlink('runtime.json');
  // }
})();
