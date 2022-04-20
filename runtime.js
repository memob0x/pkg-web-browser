const { readFile } = require('fs/promises');

const launch = require('./launch');

(async () => {
  const runtimeConfigFile = await readFile(`${__dirname}/runtime.json`, { encoding: 'utf8' });

  const runtimeConfig = JSON.parse(runtimeConfigFile);

  const {
    url,

    width,

    height,

    browser,

    data,
  } = runtimeConfig;

  await launch(url, width, height, browser, data);
})();
