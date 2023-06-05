package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"regexp"
	"sync"

	"github.com/playwright-community/playwright-go"
)

var url string

var id string

var static string

//go:embed resources
var resourcesFs embed.FS

func startStaticFilesHttpServer(d fs.FS, wg *sync.WaitGroup) *http.Server {
	re := regexp.MustCompile(`^https?:\/\/`)

	srv := &http.Server{Addr: re.ReplaceAllString(url, "")}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(d))))

	go func() {
		defer wg.Done() // let main know we are done cleaning up

		// always returns error. ErrServerClosed on graceful close
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			// unexpected error. port in use?
			log.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	// returning reference so caller can call Shutdown()
	return srv
}

func main() {
	err := playwright.Install(&playwright.RunOptions{
		Browsers: []string{"chromium"},
	})

	if err != nil {
		log.Fatalf("could not start playwright: %v", err)
	}

	pw, err := playwright.Run(&playwright.RunOptions{})

	if err != nil {
		log.Fatalf("could not start playwright: %v", err)
	}

	headless := new(bool)

	*headless = false

	device := pw.Chromium

	browser, err := device.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: headless,
	})

	if err != nil {
		log.Fatalf("could not launch browser: %v", err)
	}

	page, err := browser.NewPage(playwright.BrowserNewContextOptions{})

	if err != nil {
		log.Fatalf("could not create page: %v", err)
	}

	wg := &sync.WaitGroup{}

	d, err := fs.Sub(resourcesFs, "resources/"+id)

	if err != nil {
		log.Fatalf("invalid static files: %v", err)
	}

	wg.Add(1)

	var srv *http.Server

	if len(static) > 0 {
		srv = startStaticFilesHttpServer(d, wg)
	}

	wg.Add(1)

	if _, err = page.Goto(url); err != nil {
		log.Fatalf("could not goto: %v", err)
	}

	page.On("close", func() {
		wg.Done()

		// now close the server gracefully ("shutdown")
		// timeout could be given with a proper context
		// (in real world you shouldn't use TODO()).
		if err := srv.Shutdown(context.TODO()); err != nil {
			panic(err) // failure/timeout shutting down the server gracefully
		}

		// wait for goroutine started in startHttpServer() to stop
		wg.Wait()
	})

	wg.Wait()
}
