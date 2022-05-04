import log from './log';
import sleep from './sleep';

const loop = async (action, timeout, onError) => {
  try {
    if (!action || !await action(action)) {
      log('log', 'loop abortion in try block');

      return;
    }

    if (timeout > 0) {
      log('log', `sleeping for ${timeout}...`);

      await sleep(timeout);
    }

    await loop(action, timeout, onError);
  } catch (error) {
    if (!onError || !await onError(error)) {
      log('log', 'loop abortion in catch block');

      return;
    }

    log('log', 'resuming loop');

    await loop(action, timeout, onError);
  }
};

export default loop;
