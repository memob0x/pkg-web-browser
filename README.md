# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/pkg-web-browser/latest.svg)](https://www.npmjs.com/package/pkg-web-browser)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/pkg-web-browser.svg)](https://www.npmjs.com/package/pkg-web-browser)

Reduce a website to an executable, basically [Pkg](https://github.com/vercel/pkg) + [Puppeteeer](https://github.com/puppeteer/puppeteer) with some extra features.

## Usage

Install the npm module globally.

```sh
npm install -g pkg-web-browser
```

Build your first website package for the current host.

```sh
pkg-web-browser http://website.org /path/to/the/executable-website
```

In order to build for another architecture:

```sh
pkg-web-browser --pkg-target=node16-win-x64 http://website.org website-binary.exe
```

In order to use an existent browser ( makes the download process to be skipped):

```sh
pkg-web-browser --browser-executable-path=/path/to/browser/executable http://website.org website-binary
```

In order to use an existent user profile data (such as saved passwords or websites preferences):

```sh
pkg-web-browser --browser-user-data-dir=/path/to/browser/profiles/directory http://website.org website-binary
```

```sh
npm install --save-dev puppeteer-core

pkg-web-browser --pkg-entrypoint=./path/to/app.js http://localhost.3000 localhostapp
```

## Options
Run `pkg-web-browser --help` without arguments to see the list of options:

```console
pkg-web-browser [options]

    -h, --help                      Outputs usage information
    --pkg-target                    Defines the program architecture
    --pkg-entrypoint                Defines the pkg cli only target (eg. "pkg app.js"), the target application entrypoint (you need to install puppeteer-core in the entrypoint project)
    --browser-width                 Defines the opened website width
    --browser-height                Defines the opened website height
    --browser-revision              Sets the browser revision download host to be used during download
    --browser-product               Defines the type of browser: "chrome" or "firefox"
    --browser-args                  An arg to pass puppeteer args
    --browser-ignore-default-args   An arg to tell puppeteer to ignore some of its own default args               
 ```
