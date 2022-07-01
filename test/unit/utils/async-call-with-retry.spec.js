import chai from 'chai';

import chaiAsPromised from 'chai-as-promised';

import callAndAwaitWithRetry from '../../../src/utils/async-call-with-retry';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('src/utils/call-with-retry', () => {
  it('should be able to retry a the given function for the given times', () => {
    let calls = 0;

    expect(callAndAwaitWithRetry(() => {
      calls += 1;

      throw new Error('an error');
    }, 200)).to.be.rejected;

    // NOTE: first call + 200 retries = 201 calls
    expect(calls).to.equals(201);
  });

  it('should be able to retry a the given function for the given times returning its value when it executed successfully', () => {
    let calls = 0;

    expect(callAndAwaitWithRetry(() => {
      calls += 1;

      if (calls < 200) {
        throw new Error('an error');
      }

      return 'ok';
    }, 200)).to.not.be.rejected.and.eventually.equals('ok');

    expect(calls).to.equals(200);
  });

  it('should be able to preserve interoperability between async and sync functions', async () => {
    let calls = 0;

    const func = () => {
      calls += 1;

      if (calls === 3) {
        return 'ok';
      }

      throw new Error('ciao');
    };

    calls = 0;

    const result = callAndAwaitWithRetry(
      func,

      999,
    );

    expect(result).to.not.be.rejected.and.to.eventually.equals('ok');

    expect(calls).to.be.greaterThan(1);

    calls = 0;

    const promise = callAndAwaitWithRetry(
      func,

      999,
    );

    expect(promise).to.not.be.rejected.and.to.eventually.equals('ok');

    await promise;

    expect(calls).to.be.greaterThan(1);
  });
});
