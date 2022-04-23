const { exec } = require('pkg');

const { writeFile, unlink } = require('fs/promises');

const args = require('./args');

(async () => {
  await writeFile(`${__dirname}/main.json`, JSON.stringify(args));

  const { target, output } = args || {};

  try {
    await exec([
      './main.js',
      '--config',
      './pkg.json',
      '--compress',
      'GZip',
      '--target',
      target,
      '--output',
      output,
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  await unlink(`${__dirname}/main.json`);
})();
