import { expect } from 'chai';
import { rm, writeFile } from 'fs/promises';
import createRollup from '../../../src/utils/create-rollup';

const FS_RM_OPTIONS = { force: true };

const clearTestBed = () => Promise.all([
  rm('./create-rollup-test-0.js', FS_RM_OPTIONS),

  rm('./create-rollup-test-1.js', FS_RM_OPTIONS),

  rm('./create-rollup-test-3.js', FS_RM_OPTIONS),
]);

const prepareTestBed = () => Promise.all([
  writeFile('./create-rollup-test-0.js', 'console.log(1);'),

  writeFile('./create-rollup-test-1.js', 'console.log(2);'),

  writeFile('./create-rollup-test-3.js', 'import \'./create-rollup-test-0\'; import \'./create-rollup-test-1\';\n'),
]);

describe('src/utils/create-rollup', () => {
  it('should be able to concat js files resolving its dependencies (rollup library basic)', async () => {
    await clearTestBed();

    await prepareTestBed();

    const rollupCode = await createRollup({
      input: './create-rollup-test-3.js',
    }, {});

    expect(rollupCode)
      .to.contain('console.log(1);')
      .and.to.contain('console.log(2);');

    await clearTestBed();
  });
});
