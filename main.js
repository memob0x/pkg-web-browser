const launchBrowser = require('./src/launch-browser');

const readFileUtf8 = require('./src/read-file-utf8');

(async () => {
  const configFile = await readFileUtf8(`${__dirname}/main.json`);

  const configObject = JSON.parse(configFile);

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
