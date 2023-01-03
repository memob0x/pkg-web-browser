# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)
[![pkg-web-browser (latest)](https://img.shields.io/npm/v/pkg-web-browser/latest.svg)](https://www.npmjs.com/package/pkg-web-browser)
[![pkg-web-browser (downloads)](https://img.shields.io/npm/dy/pkg-web-browser.svg)](https://www.npmjs.com/package/pkg-web-browser)

Bundle a public website or a local web application to an executable and browse it through a web browser;

basically [Pkg](https://github.com/vercel/pkg) + [Puppeteeer](https://github.com/puppeteer/puppeteer).

## Installation

```console
npm install -g pkg-web-browser
```

## Recipees
### Bundle a public website

```console
pkg-web-browser http://website.org /path/to/the/executable-website
```

### Bundle a local node application

Move into the node application to be bundled.

```console
cd path/to/local/app
```
Install [puppeteer-core](https://www.npmjs.com/package/puppeteer-core) package.

```console
npm install --save-dev puppeteer-core
```

Bundle the local application indicating its entrypoint (usally index.js) as "pkg-entrypoint" argument.

```console
pkg-web-browser --pkg-entrypoint=index.js http://localhost:80 localhost-app
```

### Prepare a bundle for another architecture

See [Pkg](https://github.com/vercel/pkg#targets) documentation in order to get the full architectures list.

```console
pkg-web-browser --pkg-target=node16-win-x64 http://website.org website-binary.exe
```

### Prepare a windows bundle for an existent chrome

```console
pkg-web-browser --pkg-target=node16-win-x64 --browser-executable-path="C:\\\Program Files\\\Google\\\Chrome\\\Application\\\chrome.exe" --browser-user-data-dir="C:\\\Users\\\danie\\\AppData\\\Local\\\Google\\\Chrome\\\User Data" https://www.wikipedia.org/ wikipedia.exe
```

## Documentation

The first two arguments without `--` or `-` prefixes are mandatory. The first indicates the url to be navigated while the second the output file path.

```console
pkg-web-browser https://www.wikipedia.org/ wikipedia-app                   
```

To see the list of options:

```console
pkg-web-browser --help                      
```

To define the program architecture ([full list](https://github.com/vercel/pkg#targets)):

```console
pkg-web-browser --pkg-target=node16-win-x64
```

To define the optional program local entrypoint ([dedicated documentation](https://github.com/vercel/pkg#usage)):

```console
pkg-web-browser --pkg-entrypoint=app.js
```

To define an existent browser executable path:

```console
pkg-web-browser --browser-executable-path=/path/to/chromium
```

To define a browser [user-data directory](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/user_data_dir.md):

```console
pkg-web-browser --browser-user-data-dir=/path/to/browser/user/data
```

To define the type of browser:

```console
pkg-web-browser --browser-product=chrome
```

```console
pkg-web-browser --browser-product=firefox
```

To set the browser build revision:

```console
pkg-web-browser --browser-revision=1018312
```

```console
pkg-web-browser --browser-revision=98.0a1
```

To define the browser arguments:

```console
pkg-web-browser --browser-args=--kiosk
```

To ignore some of the default browser args:

```console
pkg-web-browser --browser-ignore-default-args=--enable-automation
```
