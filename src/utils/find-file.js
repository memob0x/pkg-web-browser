import { readdir, stat } from 'fs/promises';
import { dirname, join } from 'path';

const getFileData = async (parent, name) => {
  const path = join(parent, name);

  let stats = null;

  try {
    stats = await stat(path);
  } catch (e) {
    //
  }

  return { name, path, stats };
};

const getDirectoryFiles = async (path) => {
  let names = [];

  try {
    names = await readdir(path);
  } catch (e) {
    //
  }

  return Promise.all(names.map((name) => getFileData(path, name)));
};

const findInDirectories = (directories, predicate) => directories.reduce(
  async (accumulator, { path }) => {
    const accumulatorReduce = await accumulator;

    // eslint-disable-next-line no-use-before-define
    const cc = await iterateFileFinder(path, predicate, accumulatorReduce);

    return [...accumulatorReduce, ...cc];
  },

  Promise.resolve([]),
);

const getUniqueArray = (array, predicate) => array.filter(
  (c, i, self) => self.findIndex((y) => predicate(c, y)) === i,
);

const isDirectory = ({ stats }) => stats.isDirectory();

const areFilesEqual = (a, b) => a.path === b.path;

async function iterateFileFinder(path, predicate, accumulator) {
  let accumulatorCopy = [...accumulator || []];

  const filesInPath = await getDirectoryFiles(path);

  const foundFileInPath = filesInPath.find(predicate);

  if (foundFileInPath) {
    accumulatorCopy = [
      ...accumulatorCopy,

      foundFileInPath,
    ];
  }

  const directoriesInPath = filesInPath.filter(isDirectory);

  if (!directoriesInPath.length) {
    return accumulatorCopy;
  }

  const foundFilesInDirectories = await findInDirectories(
    directoriesInPath,

    predicate,
  );

  return getUniqueArray(
    [
      ...accumulatorCopy,

      ...foundFilesInDirectories,
    ],

    areFilesEqual,
  );
}

export default async function findFile(path, operand) {
  let stats = null;

  let pathClean = path;

  try {
    stats = await stat(path);
  } catch (e) {
    return [];
  }

  if (!stats.isDirectory()) {
    pathClean = dirname(pathClean);
  }

  if (typeof operand === 'function') {
    return iterateFileFinder(pathClean, operand);
  }

  if (Array.isArray(operand)) {
    return iterateFileFinder(pathClean, (x) => operand.includes(x.name));
  }

  return iterateFileFinder(pathClean, (x) => x.name === operand);
}
