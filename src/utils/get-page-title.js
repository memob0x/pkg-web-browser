import log from './log';

const getPageTitle = async (page) => {
  try {
    return page.title();
  } catch (e) {
    log('log', `Error retrieving page title, error: ${e.message}`);

    return '';
  }
};

export default getPageTitle;
