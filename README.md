# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/pkg-web-browser/latest.svg)](https://www.npmjs.com/package/pkg-web-browser)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/pkg-web-browser.svg)](https://www.npmjs.com/package/pkg-web-browser)

Bundle a public website or a local web application to an executable and browse it through a web browser;

basically [Pkg](https://github.com/vercel/pkg) + [Puppeteeer](https://github.com/puppeteer/puppeteer).

## Installation

```sh
npm install -g pkg-web-browser
```
## Bundle a public website

```sh
pkg-web-browser http://website.org /path/to/the/executable-website
```

## Bundle a local node application

Move into the node application to be bundled and install [puppeteer-core](https://www.npmjs.com/package/puppeteer-core) package.

```sh
cd path/to/local/app

npm install --save-dev puppeteer-core
```

Bundle the local application indicating its entrypoint (usally index.js) as "pkg-entrypoint" argument.

```sh
pkg-web-browser --pkg-entrypoint=index.js http://localhost:80 localhost-app
```

## Prepare a bundle for another architecture

See [vercel/pkg](https://github.com/vercel/pkg#targets) documentation in order to get the full architectures list.

```sh
pkg-web-browser --pkg-target=node16-win-x64 http://website.org website-binary.exe
```

## Options
Run `pkg-web-browser --help` without arguments to see the list of options:

```console
pkg-web-browser [options]

    -h, --help                      Outputs usage information
    --pkg-target                    Defines the program architecture
    --pkg-entrypoint                Defines the pkg cli only target (eg. "pkg app.js"), the target application entrypoint (you need to install puppeteer-core in the entrypoint project)
    --browser-revision              Sets the browser revision download host to be used during download
    --browser-product               Defines the type of browser: "chrome" or "firefox"
    --browser-args                  An arg to pass puppeteer args
    --browser-ignore-default-args   An arg to tell puppeteer to ignore some of its own default args               
 ```
