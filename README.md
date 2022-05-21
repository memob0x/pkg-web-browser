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

In order to build for another architecture, a path to the browser executable is needed.

```sh
pkg-web-browser --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Mozilla Firefox\\firefox.exe" "http://website.org" "C:\\website.exe"
```

In order to inherit an existent user profile data (such as saved passwords or websites preferences) the path to that existent profile is needed.

```sh
pkg-web-browser --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Mozilla Firefox\\firefox.exe" --browser-user-data-dir="C:\\Users\\danie\\AppData\\Local\\Mozilla\\Firefox\\Profiles\\YourProfile" "http://website.org" "C:\\website.exe"
```

## Options
Run `pkg-web-browser --help` without arguments to see the list of options:

```console
pkg-web-browser [options]

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
    --focus                         Tells the program to do its best to keep link navigation in the main window and to kill popups
 ```
