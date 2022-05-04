import { STRING_INJECTED_FLAG_NAME } from '../constants';
import evaluatePageCode from './evaluate-page-code';

const setPageInjectionFlag = (page, value) => evaluatePageCode(page, `window.${STRING_INJECTED_FLAG_NAME} = ${value};`);

export default setPageInjectionFlag;
