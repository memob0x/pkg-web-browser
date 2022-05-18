const inputTypesWhichNeedKeyboard = [
  'text',

  'email',

  'password',

  'number',

  'search',

  'tel',

  'url',
];

const isInputTypeWhichNeedKeyboard = (element) => {
  if (!element.matches('input')) {
    return false;
  }

  const { type } = element || {};

  return inputTypesWhichNeedKeyboard.includes(type);
};

export default isInputTypeWhichNeedKeyboard;
