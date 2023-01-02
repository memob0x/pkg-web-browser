const findInString = (string, needle) => (string.includes(needle) ? needle : '');

const getPuppeteerBrowserPlatform = (binaryArchitecture) => {
  const win = findInString(binaryArchitecture, 'win');

  if (win) {
    return `${win}${findInString(binaryArchitecture, '64') || '32'}`;
  }

  const mac = findInString(binaryArchitecture, 'mac');

  if (mac) {
    const macArch = findInString(binaryArchitecture, 'arm');

    return `${mac}${macArch ? `_${macArch}` : ''}`;
  }

  return 'linux';
};

export default getPuppeteerBrowserPlatform;
