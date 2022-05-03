import log from './log';

const triggerPageKeyPress = async (page, name) => {
  try {
    log('log', `keypress ${name}: start`);

    const { keyboard } = page;

    await keyboard.down(name);

    await keyboard.up(name);

    log('log', `keypress ${name}: ok`);
  } catch (e) {
    //
  }
};

export default triggerPageKeyPress;
