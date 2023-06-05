export default function getExecCommandString(
  id,

  url,

  dist,

  embed,
) {
  let command = `go build -ldflags "-X "main.url=${url}" -X "main.id=${id}"`;

  if (embed) {
    command += ` -X "main.static=${embed}"`;
  }

  command += `" -o ${dist}`;

  return command;
}
