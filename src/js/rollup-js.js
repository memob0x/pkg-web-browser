import { rollup } from 'rollup';

const rollupJs = async (opts) => {
  const { input: optsIn, output: optsOut } = opts || {};

  const input = await rollup(optsIn);

  const { output } = await input.generate(optsOut);

  const [bundle] = output || [];

  const { code } = bundle || {};

  return code || '';
};

export default rollupJs;
