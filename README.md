# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)
[![pkg-web-browser (latest)](https://img.shields.io/npm/v/pkg-web-browser/latest.svg)](https://www.npmjs.com/package/pkg-web-browser)
[![pkg-web-browser (downloads)](https://img.shields.io/npm/dy/pkg-web-browser.svg)](https://www.npmjs.com/package/pkg-web-browser)

Bundle a public website or a local web application to an executable.

## Dependencies

* [Node](https://nodejs.org/en/download)
* [Go](https://go.dev/dl/)

## Installation

```console
npm install -g pkg-web-browser
```

## Documentation

The first two arguments without `--` or `-` prefixes are mandatory. The first indicates the url to be navigated while the second the output file path.

```console
pkg-web-browser https://www.wikipedia.org/ wikipedia-app.exe
```

To see the list of options:

```console
pkg-web-browser --help
```

To build for a different operating system:

```console
pkg-web-browser --os=windows
```

To build for a specific architecture:

```console
pkg-web-browser --arch=amd64
```
