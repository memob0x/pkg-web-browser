import puppeteer from 'puppeteer';
import express from 'express';
import { resolve } from 'path';

const launch = async (
  url,

  width,

  height,

  executablePath,

  userDataDir,
) => {
  const app = express();

  app.use(express.static('.'));

  app.use('/', (req, res) => res.sendFile(resolve('./index.html')));

  let port = 0;

  let address = 'http://localhost';

  const server = app.listen(port, () => {
    port = server.address().port;

    address += `:${port}`;

    // eslint-disable-next-line no-console
    console.log(`Listening to port ${port}...`);
  });

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

  await page.addStyleTag({ url: `${address}/controls.css` });

  await page.addScriptTag({ url: `${address}/joypads.js` });

  await page.addScriptTag({ url: `${address}/controls.js` });
};

export default launch;
