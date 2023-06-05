import { URL, fileURLToPath } from 'node:url';

export default function getFileAbsolutePath(input, base) {
  return fileURLToPath(new URL(input, base));
}
