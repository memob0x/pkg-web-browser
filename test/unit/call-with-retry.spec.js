import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import callWithRetry from '../../src/utils/call-with-retry';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('src/utils/call-with-retry', async () => {
  it('should be able to ', () => {
    let calls = 0;

    expect(callWithRetry(() => {
      calls += 1;

      throw new Error('ciao');
    }, 200)).to.be.rejected;

    // NOTE: first call + 200 retries = 201 calls
    expect(calls).to.equals(201);
  });

  it(' ', () => {
    let calls = 0;

    expect(callWithRetry(() => {
      calls += 1;

      if (calls < 200) {
        throw new Error('ciao');
      }

      return 'ok';
    }, 200)).to.eventually.equals('ok');

    expect(calls).to.equals(200);
  });
});
