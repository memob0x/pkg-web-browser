import chai from 'chai';
import sleep from '../../src/js/sleep';

const { expect } = chai;

describe('sleep', () => {
  it('should pause execution of async functions for the given amount of time (in ms)', async () => {
    const start = performance.now();

    await sleep(120);

    const end = performance.now();

    const elapsed = end - start;

    expect(elapsed).to.be.greaterThanOrEqual(120);
  });
});
