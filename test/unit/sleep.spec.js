import chai from 'chai';
import sleep from '../../src/js/utils/sleep';

const { expect } = chai;

describe('sleep', () => {
  it('should pause execution of async functions for the given amount of time (in ms)', async () => {
    const start = Date.now();

    await sleep(120);

    const end = Date.now();

    const elapsed = end - start;

    expect(elapsed).to.be.greaterThanOrEqual(120);
  });
});
