# pkg-website-gamepad

![Node.js CI](https://github.com/memob0x/pkg-website-gamepad/workflows/Node.js%20CI/badge.svg)

Bundle a public website and control it with a gamepad.

## Usage

```sh
npm install -g pkg-website-gamepad
```

After installing it, run `pkg-website-gamepad --help` without arguments to see list of options:

```console
pkg-website-gamepad [options]

  Options:

    -h, --help            output usage information
    -u, --url             defines the opened website url
    -vw, --width          defines the opened website viewport width
    -vh, --height         defines the opened website viewport height
    -b, --browser         defines the used browser path
    -p, --profile         defines the used browser path
    -t, --target          defines the final program architecture
    -o, --output          defines the final program output file
    -k, --kiosk           defines whether the final program should open in kiosk mode or not

  Examples:

  – Makes an executable for current architecture
    $ pkg-website-gamepad -u "https://website.com"
  - Makes an executable for windows
    $ pkg-website-gamepad -t node16-win-x64 -u "https://website.com"
  - Makes an executable for windows using an existing chrome installation and chrome profile
    $ pkg-website-gamepad -t node16-win-x64 -b "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" -p "C:\\Users\\danie\\AppData\\Local\\Google\\Chrome\\User Data\\Default" -u https://website.com -o "website.exe"
```
