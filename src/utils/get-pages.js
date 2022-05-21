import promiseRaceWithTimeout from './promise-race-with-timeout';

const getPages = (browser) => promiseRaceWithTimeout([browser.pages()], 1500);

export default getPages;
