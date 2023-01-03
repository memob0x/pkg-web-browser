import { expect } from 'chai';
import getPuppeteerBrowserPlatform from '../../../src/utils/get-puppeteer-browser-platform';

describe('src/utils/get-puppeteer-browser-platform', () => {
  it('should be able to get puppeteer "platform" argument from Pkg "arch" argument', () => {
    expect(getPuppeteerBrowserPlatform('node14-linux-arm64')).to.equal('linux');

    expect(getPuppeteerBrowserPlatform('node14-win-arm64')).to.equal('win64');

    expect(getPuppeteerBrowserPlatform('node14-win-idk')).to.equal('win32');

    expect(getPuppeteerBrowserPlatform('node14-macos-x64')).to.equal('mac');

    expect(getPuppeteerBrowserPlatform('node14-macos-arm64')).to.equal('mac_arm');
  });
});
