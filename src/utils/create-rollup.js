import { rollup } from 'rollup';

const createRollup = async (inputOptions, outputOptions) => {
  const input = await rollup(inputOptions);

  const { output } = await input.generate(outputOptions);

  const [bundle] = output || [];

  const { code } = bundle || {};

  return code || '';
};

export default createRollup;
