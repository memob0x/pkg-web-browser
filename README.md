# pkg-website-gamepad

![Node.js CI](https://github.com/memob0x/pkg-website-gamepad/workflows/Node.js%20CI/badge.svg)

Reduce a website to an executable and control it with a gamepad.

Handy for media centers, presentations or accessibility assessment purposes.

## Usage

```sh
npm install -g pkg-website-gamepad
```

After installing it, run `pkg-website-gamepad --help` without arguments to see list of options:

```console
pkg-website-gamepad [options]

  Options:

    -h, --help                  output usage information
    --pkg-target                defines the final program architecture
    --browser-executable-path   defines the used browser executable path
    --browser-user-data-dir     defines the used browser profile directory path
    --browser-viewport-width    defines the opened website viewport width
    --browser-viewport-height   defines the opened website viewport height
    --browser-window-mode       defines whether the final program should open in kiosk mode or in other supported mode

  Examples:

  – Makes an executable for the current architecture
    $ pkg-website-gamepad "https://website.com"
  - Makes an executable for windows
    $ pkg-website-gamepad --pkg-target=node16-win-x64 "https://website.com" "website.exe"
  - Makes an executable for windows using an existing chrome installation and chrome profile
    $ pkg-website-gamepad --pkg-target=node16-win-x64 --browser-exeuctable-path="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --browser-user-data-dir="C:\\Users\\danie\\AppData\\Local\\Google\\Chrome\\User Data\\Default" https://website.com "website.exe"
```
