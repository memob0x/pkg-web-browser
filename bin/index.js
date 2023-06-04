/* eslint-disable no-console */
const { option } = require('argv');
const { exec } = require('child_process');
const { resolve } = require('path');

const {
  targets,

  options,
} = option([
  {
    name: 'os',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --os=windows'",
  },

  {
    name: 'arch',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --arch=amd64'",
  },
]).run();

const [
  url = '',

  binaryFilePath = '.',
] = targets;

const {
  os,

  arch,
} = options;

if (os) {
  process.env.GOOS = os;
}

if (arch) {
  process.env.GOARCH = arch;
}

process.chdir(resolve(__dirname, '..'));

exec(
  `go build -ldflags "-X "main.url=${url}"" -o ${resolve(binaryFilePath)}`,

  (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);

      return;
    }

    console.log(stdout);
  },
);
