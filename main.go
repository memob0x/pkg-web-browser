package main

import (
	"embed"
	"pkg-web-browser/lib"
)

var url string

var id string

var static string

//go:embed resources
var resourcesFs embed.FS

func main() {
	err := lib.LaunchClientAndServer(
		id,

		url,

		resourcesFs,

		static,
	)

	if err != nil {
		panic(err)
	}
}
