export default function getExecCommandString(
  id,

  url,

  dist,

  embed,
) {
  let command = 'go build';

  if (embed) {
    command += ' -tags=static';
  }

  command += ` -ldflags "-X "main.url=${url}" -X "main.id=${id}"" -o ${dist}`;

  return command;
}
