import { randomUUID } from 'node:crypto';
import { copy } from 'fs-extra';
import { dirname } from 'node:path';
import childProcessExec from '../lib/child-process-exec.js';
import parseCliArguments from '../lib/parse-cli-arguments.js';
import getExecCommandString from '../lib/get-exec-command-string.js';
import createDisposableDirectory from '../lib/create-disposable-directory.js';
import getFileAbsolutePath from '../lib/get-file-absolute-path.js';

const {
  url,

  outputPath,

  os,

  arch,

  staticPath,
} = parseCliArguments();

if (os) {
  process.env.GOOS = os;
}

if (arch) {
  process.env.GOARCH = arch;
}

const baseUrl = import.meta.url;

const rootPath = getFileAbsolutePath(`${dirname(getFileAbsolutePath(baseUrl))}/..`, baseUrl);

const instanceId = randomUUID();

const instanceResourcesPath = getFileAbsolutePath(`${rootPath}resources/${instanceId}`, baseUrl);

(async () => {
  const deleteInstanceResourcesDirectory = await createDisposableDirectory(instanceResourcesPath);

  if (staticPath) {
    await copy(
      getFileAbsolutePath(`${process.cwd()}/${staticPath}`, baseUrl),

      instanceResourcesPath,

      {
        overwrite: true,
      },
    );
  }

  process.chdir(rootPath);

  await childProcessExec(
    getExecCommandString(
      instanceId,

      url,

      getFileAbsolutePath(outputPath, baseUrl),

      staticPath,
    ),
  );

  await deleteInstanceResourcesDirectory();
})();
