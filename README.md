# pkg-website-gamepad

![Node.js CI](https://github.com/memob0x/pkg-website-gamepad/workflows/Node.js%20CI/badge.svg)

Reduce a website to an executable and control it with a gamepad.

Handy for media centers, presentations or accessibility assessment purposes.

## Usage

Install the npm module globally.

```sh
npm install -g pkg-website-gamepad
```

Build your first website package for the current host.

```sh
pkg-website-gamepad "http://website.org" /path/to/the/executable-website
```

In order to build for another architecture, a path to the browser executable is needed.

```sh
pkg-website-gamepad --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" https://website.com "C:\\website.exe"
```

In order to inherit an existent user profile data (such as saved passwords or websites preferences) the path to that existent profile is needed.

```sh
pkg-website-gamepad --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --browser-user-data-dir="C:\\Users\\[USER]\\AppData\\Local\\Google\\Chrome\\User Data\\Default" https://website.com "C:\\website.exe"
```

## Options
Run `pkg-website-gamepad --help` without arguments to see the list of options:

```console
pkg-website-gamepad [options]

    -h, --help                  Outputs usage information
    --pkg-target                Defines the program architecture
    --browser-executable-path   Defines the used browser executable path
    --browser-user-data-dir     Defines the used browser profile directory path
    --browser-width             Defines the opened website width
    --browser-height            Defines the opened website height
    --kiosk                     Defines whether the program should open in kiosk mode or not
    --focus                     Defines whether the program should always stay on top disallowing other pages opening (automatically closes all popups)
    --loop-interval-time        Defines the program internal process frequency time (in ms) for it to compute updates
```
