const findInString = (string, needle) => (string.includes(needle) ? needle : '');

const getBrowserPlatform = (binaryFileArch) => {
  const win = findInString(binaryFileArch, 'win');

  if (win) {
    return [win, findInString(binaryFileArch, '64') || '32'].join('');
  }

  const mac = findInString(binaryFileArch, 'mac');

  if (mac) {
    return [mac, findInString(binaryFileArch, 'arm')].join('_');
  }

  return 'linux';
};

export default getBrowserPlatform;
