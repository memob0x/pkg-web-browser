//go:build static

package main

import (
	"pkg-web-browser/lib"
)

func init() {
	serverLauncher = lib.LaunchServer
}
