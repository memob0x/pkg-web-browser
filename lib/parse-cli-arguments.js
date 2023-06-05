import pkg from 'argv';

const { option } = pkg;

export default function parseCliArguments() {
  const {
    targets,

    options,
  } = option([
    {
      name: 'os',
      type: 'string',
      description: ' ',
      example: "'pkg-web-browser --os=windows'",
    },

    {
      name: 'arch',
      type: 'string',
      description: ' ',
      example: "'pkg-web-browser --arch=amd64'",
    },

    {
      name: 'static',
      type: 'string',
      description: ' ',
      example: "'pkg-web-browser --static=./path/to/static/'",
    },
  ]).run();

  const [
    url = '',

    outputPath = '.',
  ] = targets;

  const {
    os,

    arch,

    static: staticPath,
  } = options;

  return {
    url,

    outputPath,

    os,

    arch,

    staticPath,
  };
}
