const launch = require('./src/launch');

const read = require('./src/read');

(async () => {
  const runtimeConfigFile = await read(`${__dirname}/runtime.json`);

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
