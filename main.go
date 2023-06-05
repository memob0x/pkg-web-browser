package main

import (
	"context"
	"embed"
	"io/fs"
	"net/http"
	"pkg-web-browser/lib"
	"sync"
)

var url string

var id string

//go:embed resources
var resourcesFs embed.FS

var serverLauncher = func(
	id string,

	url string,

	resourcesFs fs.FS,
) (*http.Server, *sync.WaitGroup, error) {
	return nil, nil, nil
}

func main() {
	server, serverWaitGroup, err := serverLauncher(
		id,

		url,

		resourcesFs,
	)

	if err != nil {
		panic(err)
	}

	browserWaitGroup, err := lib.LaunchBrowser(
		url,
	)

	if err != nil {
		panic(err)
	}

	browserWaitGroup.Wait()

	if server == nil {
		return
	}

	err = server.Shutdown(context.TODO())

	if err != nil {
		panic(err)
	}

	serverWaitGroup.Wait()
}
