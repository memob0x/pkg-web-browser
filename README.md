# pkg-website

![Node.js CI](https://github.com/memob0x/pkg-website/workflows/Node.js%20CI/badge.svg)

Reduce a website to an executable, basically [Pkg](https://github.com/vercel/pkg) + [Puppeteeer](https://github.com/puppeteer/puppeteer) with some extra features.

## Usage

Install the npm module globally.

```sh
npm install -g pkg-website
```

Build your first website package for the current host.

```sh
pkg-website --args="--app=http://website.org" /path/to/the/executable-website
```

In order to build for another architecture, a path to the browser executable is needed.

```sh
pkg-website --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --args="--app=http://website.org" "C:\\website.exe"
```

In order to inherit an existent user profile data (such as saved passwords or websites preferences) the path to that existent profile is needed.

```sh
pkg-website --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --browser-user-data-dir="C:\\Users\\[USER]\\AppData\\Local\\Google\\Chrome\\User Data\\Default" --args="--app=http://website.org" "C:\\website.exe"
```

## Options
Run `pkg-website --help` without arguments to see the list of options:

```console
pkg-website [options]

    -h, --help                      Outputs usage information
    --pkg-target                    Defines the program architecture
    --browser-executable-path       Defines the used browser executable path
    --browser-user-data-dir         Defines the used browser profile directory path
    --browser-width                 Defines the opened website width
    --browser-height                Defines the opened website height
    --browser-product               Defines the type of browser, "chrome", "firefox" ...
    --browser-args                  An arg to pass puppeteer args
    --browser-ignore-default-args   An arg to tell puppeteer to ignore some of its own default args               
    --custom-styles                 Passes custom styles to be injected in browser (multiple files shall be comma separated)
    --custom-scripts                Passes custom scripts to be injected in browser (multiple files shall be comma separated)
    --focus                         Does its best to keeps link navigation in the main window and to automatically kill window popups
    --loop-interval-time            Defines the program internal process frequency time (in ms) for it to compute updates
```
