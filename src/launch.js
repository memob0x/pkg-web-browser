const puppeteer = require('puppeteer');

const read = require('./read');

const launch = async (
  url,

  width,

  height,

  executablePath,

  userDataDir,
) => {
  const [css, js1, js2] = await Promise.all([
    read(`${__dirname}/injected/controls.css`),

    read(`${__dirname}/injected/joypads.js`),

    read(`${__dirname}/injected/controls.js`),
  ]);

  const browser = await puppeteer.launch({
    headless: false,

    userDataDir,

    executablePath,

    ignoreDefaultArgs: [
      '--enable-automation',
    ],

    args: [
      `--app=${url}`,

      '--kiosk',

      '--new-window',
    ],
  });

  const [page] = await browser.pages();

  await page.setViewport({ width, height });

  await page.waitForNavigation();

  await page.addStyleTag({ content: css });

  await page.addScriptTag({ content: js1 });

  await page.addScriptTag({ content: js2 });
};

module.exports = launch;
