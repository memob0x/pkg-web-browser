const launchBrowser = require('./src/launch-browser');

const readFileUtf8 = require('./src/read-file-utf8');

const args = require('./args');

(async () => {
  const configFile = await readFileUtf8(`${__dirname}/main.json`);

  const configObject = configFile ? JSON.parse(configFile) : args;

  const {
    url,

    width,

    height,

    browser,

    profile,

    kiosk,
  } = configObject;

  await launchBrowser(url, width, height, browser, profile, kiosk);
})();
