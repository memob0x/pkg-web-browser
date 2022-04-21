const puppeteer = require('puppeteer');

const readFileUtf8 = require('./read-file-utf8');

const launchBrowser = async (
  url,

  width,

  height,

  executablePath,

  userDataDir,

  kiosk,
) => {
  const [css, js1, js2] = await Promise.all([
    readFileUtf8(`${__dirname}/injected/controls.css`),

    readFileUtf8(`${__dirname}/injected/joypads.js`),

    readFileUtf8(`${__dirname}/injected/controls.js`),
  ]);

  const args = [
    `--app=${url}`,

    '--new-window',
  ];

  if (kiosk) {
    args.push('--kiosk');
  }

  const browser = await puppeteer.launch({
    headless: false,

    userDataDir,

    executablePath,

    ignoreDefaultArgs: [
      '--enable-automation',
    ],

    args,
  });

  const [page] = await browser.pages();

  await page.setViewport({ width, height });

  await page.waitForNavigation({ waitUntil: 'load' });

  const pollExecutionCheck = async () => {
    try {
      if (!await page.evaluate('window.puppeteer')) {
        await Promise.all([
          page.addStyleTag({ content: css }),

          page.addScriptTag({ content: js1 }),

          page.addScriptTag({ content: js2 }),

          page.evaluate('window.puppeteer = true'),
        ]);
      }
    } catch (e) {
      //
    }

    await pollExecutionCheck();
  };

  pollExecutionCheck();
};

module.exports = launchBrowser;
