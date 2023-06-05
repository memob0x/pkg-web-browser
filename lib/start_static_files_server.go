package lib

import (
	"io/fs"
	"net/http"
	"regexp"
)

func StartStaticFilesHttpServer(url string, d fs.FS, cb func()) (*http.Server, error) {
	re := regexp.MustCompile(`^https?:\/\/`)

	addr := re.ReplaceAllString(url, "")

	srv := &http.Server{Addr: addr}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(d))))

	var err error

	go func() {
		defer cb()

		anErr := srv.ListenAndServe()

		if anErr != http.ErrServerClosed {
			err = anErr
		}
	}()

	return srv, err
}
