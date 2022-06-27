# pkg-web-browser

![Node.js CI](https://github.com/memob0x/pkg-web-browser/workflows/Node.js%20CI/badge.svg)

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

## Options
Run `pkg-web-browser --help` without arguments to see the list of options:

```console
pkg-web-browser [options]

    -h, --help                      Outputs usage information
    --pkg-target                    Defines the program architecture
    --browser-user-data-dir         Defines the used browser profile directory path
    --browser-width                 Defines the opened website width
    --browser-height                Defines the opened website height
    --browser-executable-path       Sets an existent browser executable path to be used during browser launch
    --browser-download-host         Sets the browser executable download host to be used during download
    --browser-download-path         The place where the download browser is stored
    --browser-revision              Sets the browser revision download host to be used during download
    --browser-product               Defines the type of browser: "chrome" or "firefox"
    --browser-args                  An arg to pass puppeteer args
    --browser-ignore-default-args   An arg to tell puppeteer to ignore some of its own default args               
    --custom-styles                 Passes custom styles to be injected in browser (multiple files shall be comma separated)
    --custom-scripts                Passes custom scripts to be injected in browser (multiple files shall be comma separated)
    --focus                         Tells the program to do its best to keep link navigation in the main window and to kill popups
 ```
