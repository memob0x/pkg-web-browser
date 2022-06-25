import { rollup } from 'rollup';

const createJsBundleFile = async (inputOptions, outputOptions) => {
  const input = await rollup(inputOptions);

  const { output } = await input.generate(outputOptions);

  const [bundle] = output || [];

  const { code } = bundle || {};

  return code || '';
};

export default createJsBundleFile;
