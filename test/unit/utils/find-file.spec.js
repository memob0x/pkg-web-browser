import chai from 'chai';
import {
  mkdir, rm, writeFile,
} from 'fs/promises';
import chaiAsPromised from 'chai-as-promised';
import findFile from '../../../src/utils/find-file';

chai.use(chaiAsPromised);

const { expect } = chai;

const FS_RM_OPTIONS = { recursive: true, force: true };

const clearTestBed = async () => rm('./foo', FS_RM_OPTIONS);

const findFilesPaths = async (...args) => (await findFile(...args)).map((x) => x.path);

const prepareTestBed = async () => {
  await clearTestBed();

  await mkdir('./foo');

  await mkdir('./foo/bar');

  await mkdir('./foo/biz');

  await mkdir('./foo/biz/bar');

  await mkdir('./foo/biz/zz');

  await writeFile('./foo/biz/zz/1.txt', 'hello');
};

describe('src/utils/find-file', () => {
  it('should not throw errors when inconsistent arguments are provided', async () => {
    await prepareTestBed();

    expect(await findFilesPaths(undefined, '1.txt')).to.deep.equal([]);

    await clearTestBed();
  });

  it('should be able to find a file by file name', async () => {
    await prepareTestBed();

    expect(await findFilesPaths('./foo', '1.txt')).to.deep.equal(['foo/biz/zz/1.txt']);

    await clearTestBed();
  });

  it('should be able to find a file if the given file path is already given as the "path" argument', async () => {
    await prepareTestBed();

    expect(await findFilesPaths('foo/biz/zz/1.txt', '1.txt')).to.deep.equal(['foo/biz/zz/1.txt']);

    await clearTestBed();
  });

  it('should be able to find a folder by folder name', async () => {
    await prepareTestBed();

    expect(await findFilesPaths('./foo', 'bar')).to.deep.equal(['foo/bar', 'foo/biz/bar']);

    await clearTestBed();
  });

  it('should be able to find a multiple files or folders by their names', async () => {
    await prepareTestBed();

    expect(await findFilesPaths('./foo', ['bar', '1.txt'])).to.deep.equal(['foo/bar', 'foo/biz/bar', 'foo/biz/zz/1.txt']);

    await clearTestBed();
  });

  it('should be able to find a multiple files or folders by a given predicate function', async () => {
    await prepareTestBed();

    expect(await findFilesPaths('./foo', (x) => x.name === 'bar' || x.name.endsWith('.txt'))).to.deep.equal(['foo/bar', 'foo/biz/bar', 'foo/biz/zz/1.txt']);

    await clearTestBed();
  });
});
