import { exec } from 'node:child_process';

export default async function childProcessExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);

        return;
      }

      resolve(stdout);
    });
  });
}
