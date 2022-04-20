const puppeteer = require('puppeteer');

const { readFile } = require('fs/promises');

const launch = async (
  url,

  width,

  height,

  executablePath,

  userDataDir,
) => {
  const a = await readFile(`${__dirname}/controls.css`, { encoding: 'utf8' });

  const b = await readFile(`${__dirname}/joypads.js`, { encoding: 'utf8' });

  const c = await readFile(`${__dirname}/controls.js`, { encoding: 'utf8' });

  const browser = await puppeteer.launch({
    headless: false,

    ignoreDefaultArgs: ['--enable-automation'],

    userDataDir,

    executablePath,

    args: [`--app=${url}`, '--kiosk', '--new-window'],
  });

  const [page] = await browser.pages();

  await page.setViewport({ width, height });

  await page.waitForNavigation();

  await page.addStyleTag({ content: a });

  await page.addScriptTag({ content: b });

  await page.addScriptTag({ content: c });
};

module.exports = launch;
