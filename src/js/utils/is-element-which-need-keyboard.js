import isInputTypeWhichNeedKeyboard from './is-input-type-which-need-keyboard';

const isElementWichNeedKeyboard = (element) => element.matches('textarea') || isInputTypeWhichNeedKeyboard(element);

export default isElementWichNeedKeyboard;
