import { expect } from 'chai';
import { rm, mkdir, writeFile } from 'fs/promises';
import findPuppeteerBrowser from '../../../src/utils/find-puppeteer-browser';

describe('src/utils/find-puppeteer-browser', () => {
  it('should be able to find the first browser executable in given path', async () => {
    await rm('./fpbtest', { force: true, recursive: true });

    await mkdir('./fpbtest/biz/zz', { recursive: true });

    await writeFile('./fpbtest/biz/zz/chrome', '123');

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('fpbtest/biz/zz/chrome');

    await writeFile('./fpbtest/firefox', '123');

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('fpbtest/firefox');

    await rm('./fpbtest', { force: true, recursive: true });
  });

  it('should be able to find binary files only, avoiding directories', async () => {
    await rm('./fpbtest', { force: true, recursive: true });

    await mkdir('./fpbtest/biz/zz/folder/chrome', { recursive: true });

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('');

    await rm('./fpbtest', { force: true, recursive: true });
  });

  it('should be able to find the first browser executable matching the given "product" option', async () => {
    await rm('./fpbtest', { force: true, recursive: true });

    await mkdir('./fpbtest/biz/zz', { recursive: true });

    await writeFile('./fpbtest/biz/zz/chrome', '123');

    await writeFile('./fpbtest/biz/zz/firefox', '123');

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('fpbtest/biz/zz/chrome');

    expect(await findPuppeteerBrowser('./fpbtest', { product: 'firefox' })).to.equal('fpbtest/biz/zz/firefox');

    await rm('./fpbtest', { force: true, recursive: true });
  });

  it('should be able to find the first browser executable matching the given "platform" option', async () => {
    await rm('./fpbtest', { force: true, recursive: true });

    await mkdir('./fpbtest/biz/zz', { recursive: true });

    await writeFile('./fpbtest/biz/zz/chrome', '123');

    await writeFile('./fpbtest/biz/zz/chrome.exe', '123');

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('fpbtest/biz/zz/chrome');

    expect(await findPuppeteerBrowser('./fpbtest', { platform: 'win' })).to.equal('fpbtest/biz/zz/chrome.exe');

    await rm('./fpbtest', { force: true, recursive: true });
  });

  it('should be able to find the first browser executable matching the given "revision" option', async () => {
    await rm('./fpbtest', { force: true, recursive: true });

    await mkdir('./fpbtest/biz/zz/111111111', { recursive: true });

    await writeFile('./fpbtest/biz/zz/chrome', '123');

    await writeFile('./fpbtest/biz/zz/111111111/chrome', '123');

    expect(await findPuppeteerBrowser('./fpbtest')).to.equal('fpbtest/biz/zz/chrome');

    expect(await findPuppeteerBrowser('./fpbtest', { revision: '111111111' })).to.equal('fpbtest/biz/zz/111111111/chrome');

    await rm('./fpbtest', { force: true, recursive: true });
  });
});
