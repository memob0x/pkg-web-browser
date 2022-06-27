import puppeteer from 'puppeteer-core';
import log from './log';

const downloadBrowser = async (
  path,

  host, // https://archive.mozilla.org/pub/firefox/nightly/2022/02/2022-02-07-06-58-16-mozilla-central

  platform, // win32 | win64 | mac | mac_arm ...

  product = 'chrome', // firefox | chrome

  revision = '1018312', // 98.0a1 | 1018312
) => {
  log('log', `downloading browser ${product} ${revision} ${platform} ${host ? `from ${host}` : ''}`);

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
