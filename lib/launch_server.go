package lib

import (
	"fmt"
	"io/fs"
	"net/http"
	"regexp"
	"sync"
)

func LaunchServer(
	id string,

	url string,

	resourcesFs fs.FS,
) (*http.Server, *sync.WaitGroup, error) {
	server := &http.Server{Addr: url}

	serverWaitGroup := &sync.WaitGroup{}

	instanceResourcesFs, err := fs.Sub(resourcesFs, "resources/"+id)

	if err != nil {
		return server, serverWaitGroup, fmt.Errorf("invalid static files: %v", err)
	}

	re := regexp.MustCompile(`^https?:\/\/`)

	if len(re.FindAllString(url, -1)) > 0 {
		return server, serverWaitGroup, fmt.Errorf("invalid address, please provide a local address withtout protocol")
	}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(instanceResourcesFs))))

	serverWaitGroup.Add(1)

	// since ListenAndServe
	go func() {
		serverWaitGroup.Done()

		// TODO: return ListenAndServe() != http.ErrServerClosed error somehow
		_ = server.ListenAndServe()
	}()

	return server, serverWaitGroup, nil
}
