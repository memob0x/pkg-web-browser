import puppeteer from 'puppeteer-core';
import log from './log';

const downloadBrowser = async (
  path,

  host = 'https://archive.mozilla.org/pub/firefox/nightly/2022/02/2022-02-07-06-58-16-mozilla-central',

  platform = 'win64',

  product = 'firefox',

  revision = '98.0a1',
) => {
  log('log', `downloading browser ${product} ${revision} ${platform} from ${host}`);

  const browserFetcher = puppeteer.createBrowserFetcher({
    host,

    path,

    platform,

    product,
  });

  const { executablePath } = await browserFetcher.download(revision);

  log('log', `browser downloaded: ${executablePath}`);

  return executablePath;
};

export default downloadBrowser;
