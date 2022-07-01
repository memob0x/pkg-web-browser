import { expect } from 'chai';

import generateId from '../../../src/utils/generate-id';

describe('src/utils/generate-id', async () => {
  it('should be able to await a promise safely, handling rejection with a default value', () => {
    const ids = [];

    for (let i = 0; i < 2500; i += 1) {
      const id = generateId();

      // should be a string
      expect(id).to.be.a('string');

      // should be a string of digits only
      expect(/[^0-9]/.test(id)).to.be.false;

      // should not generate duplicates
      expect(ids).to.not.include(id);

      ids.push(id);
    }
  });
});
