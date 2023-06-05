/* eslint-disable no-console */
const { option: argvOption } = require('argv');
const { exec: childProcExec } = require('child_process');
const { randomUUID } = require('crypto');
const { resolve: pathResolve } = require('path');
const { copy: fsCopy } = require('fs-extra');
const { rm, mkdir } = require('fs/promises');

const childProcExecAsync = async (command) => new Promise((resolve, reject) => {
  childProcExec(
    command,

    (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr));

        return;
      }

      resolve(stdout);
    },
  );
});

const {
  targets,

  options,
} = argvOption([
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

  {
    name: 'static',
    type: 'string',
    description: ' ',
    example: "'pkg-web-browser --static=./path/to/static/'",
  },
]).run();

const [
  url = '',

  binaryFilePath = '.',
] = targets;

const {
  os,

  arch,

  static: embed,
} = options;

if (os) {
  process.env.GOOS = os;
}

if (arch) {
  process.env.GOARCH = arch;
}

const id = randomUUID();

(async () => {
  let command = `go build -ldflags "-X "main.url=${url}" -X "main.id=${id}"`;

  if (embed) {
    command += ` -X "main.static=${embed}"`;

    try {
      await mkdir(pathResolve(__dirname, '..', 'resources', id), {
        recursive: true,
      });
    } catch (e) {
      console.log(e);
    }

    await fsCopy(pathResolve(process.cwd(), embed), pathResolve(__dirname, '..', 'resources', id));
  }

  command += `" -o ${pathResolve(binaryFilePath)}`;

  process.chdir(pathResolve(__dirname, '..'));

  try {
    console.log(await childProcExecAsync(command));
  } catch (e) {
    console.error(e);
  }

  if (embed) {
    await rm(pathResolve(__dirname, '..', 'resources', id), {
      recursive: true,
    });
  }
})();
