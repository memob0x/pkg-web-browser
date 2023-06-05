# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)
[![pkg-web-browser (latest)](https://img.shields.io/npm/v/pkg-web-browser/latest.svg)](https://www.npmjs.com/package/pkg-web-browser)
[![pkg-web-browser (downloads)](https://img.shields.io/npm/dy/pkg-web-browser.svg)](https://www.npmjs.com/package/pkg-web-browser)

Bundle a public example or a local web application into a single executable file.

## Dependencies

* [Node >= 20](https://nodejsen/download)
* [Go >= 1.20](https://go.dev/dl/)

## Installation

```console
npm install -g pkg-web-browser
```

## Usage

The first two unprefixed arguments are mandatory: the first indicates the url to be navigated, the second the output file path.

```console
pkg-web-browser https://example.com ./path/to/example-app
```

To see the list of options:

```console
pkg-web-browser --help
```

To build for a different operating system:

```console
pkg-web-browser example.com example.exe --os=windows
```

To build for a specific architecture:

```console
pkg-web-browser example.com example --arch=amd64
```

To bundle a static files directory:

```console
pkg-web-browser localhost:8080 bundle --static=./path/to/dist
```
