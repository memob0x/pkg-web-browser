import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import awaitSafely from '../../src/utils/await-safely';

chai.use(chaiAsPromised);

const { expect } = chai;

describe('src/utils/await-safely', () => {
  it('should be able to await a promise safely, handling rejection with a default value', () => {
    const rejection = Promise.reject(new Error('err'));

    expect(rejection).to.be.rejected;

    expect(awaitSafely(rejection, 'default-value')).to.eventually.equal('default-value');
  });
});
