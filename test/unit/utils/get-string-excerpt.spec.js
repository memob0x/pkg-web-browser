import { expect } from 'chai';
import getStringExcerpt from '../../../src/utils/get-string-excerpt';

describe('src/utils/get-string-excerpt', () => {
  it('should be able to truncate long strings (with default max chars)', () => {
    const string = '123456789123456789123456789123456789123456789123456789';

    expect(getStringExcerpt(string)).to.be.equal('1234567891234567891234567891234567891234...');
  });

  it('should be able to truncate long strings (with given max chars)', () => {
    const string = '123';

    expect(getStringExcerpt(string, 2)).to.be.equal('12...');
  });

  it('should be able to keep short strings untouched', () => {
    const string = '12';

    expect(getStringExcerpt(string, 2)).to.be.equal(string);
  });
});
