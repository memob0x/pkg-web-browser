# pkg-website-gamepad

[![Build Status](https://github.com/memob0x/pkg-website-gamepad/actions/workflows/ci.yml/badge.svg)](https://github.com/memob0x/pkg-website-gamepad/actions/workflows/ci.yml)


```console
npm run build -- -t node16-win-x64 -b "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" -d "C:\\Users\\danie\\AppData\\Local\\Google\\Chrome\\User Data\\NetflixKiosk" -u https://netflix.com -o "netflix.exe"
```

## Usage

```sh
npm install -g pkg-website-gamepad
```

After installing it, run `pkg-website-gamepad --help` without arguments to see list of options:

```console
pkg-website-gamepad [options]

  Options:

    -h, --help           output usage information

  Examples:

  – Makes executables for Linux, macOS and Windows
    $ pkg-website-gamepad -u "https://netflix.com"
  - 
    $ pkg-website-gamepad -t node16-win-x64 
  - 
    $ pkg-website-gamepad -t node16-win-x64 -b "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" -d "C:\\Users\\danie\\AppData\\Local\\Google\\Chrome\\User Data\\NetflixKiosk" -u https://netflix.com -o "netflix.exe"
```
