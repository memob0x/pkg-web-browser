import log from './log';

const triggerHandledElementMethod = async (element, method) => {
  try {
    await element[method]();
  } catch ({ message }) {
    log('error', message);
  }
};

export default triggerHandledElementMethod;
