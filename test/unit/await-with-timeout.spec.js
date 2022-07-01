import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import awaitWithTimeout from '../../src/utils/await-with-timeout';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('src/utils/await-with-timeout', () => {
  it('should be able to wait for a given amount of time the given promise and fail if the time gets exceeded', () => {
    const longTask = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve('ok');
      }, 1000);
    });

    expect(awaitWithTimeout(longTask(), 1000)).to.eventually.equal('ok');

    expect(awaitWithTimeout(longTask(), 1001)).to.be.rejected;
  });
});
