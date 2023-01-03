import { join } from 'path';

export const STRING_NODE_PROCESS_WORKING_DIR_PATH = process.cwd();

export const STRING_EXECUTED_FILE_WORKING_DIR_PATH = __dirname;

export const STRING_PUPPETEER_BROWSER_DEFAULT_EXECUTABLE_PATH = join(
  STRING_NODE_PROCESS_WORKING_DIR_PATH,

  'pkg-web-browser',
);

export const STRING_PUPPETEER_BROWSER_DEFAULT_USER_DATA_DIR_PATH = join(
  STRING_NODE_PROCESS_WORKING_DIR_PATH,

  'pkg-web-browser-user',
);
