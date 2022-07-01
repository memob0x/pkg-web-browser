import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { JSDOM } from 'jsdom';
import disallowNewPages from '../../../src/browser/disallow-new-pages';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('src/browser/disallow-new-pages', () => {
  it('should be able to highjack window.open to window.console.log', () => {
    const clientMock = {
      open: () => {},

      console: {
        log: () => {},
      },
    };

    expect(disallowNewPages(clientMock)).to.be.undefined;

    expect(clientMock.open).to.to.equal(clientMock.console.log);
  });

  it('should be able to remove all "target" attributes from all anchor elements in page', () => {
    const { window } = new JSDOM(
      `<html>
        <body>
          <a href="#">stay here</a>
          <a href="#" target="_blank">take me wawait</a>
          <a href="#" target="_self">stay here too</a>
        </body>
      </html>`,
      { url: 'http://localhost' },
    );

    expect(disallowNewPages(window)).to.be.undefined;

    const links = [...window.document.querySelectorAll('a')];

    expect(links.every((x) => !x.getAttribute('target'))).to.be.true;
  });
});
