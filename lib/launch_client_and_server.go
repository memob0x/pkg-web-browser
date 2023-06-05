package lib

import (
	"context"
	"fmt"
	"io/fs"
	"net/http"
	"sync"

	"github.com/playwright-community/playwright-go"
)

func LaunchClientAndServer(
	id string,

	url string,

	resourcesFs fs.FS,

	static string,
) error {
	err := playwright.Install(&playwright.RunOptions{
		Browsers: []string{"webkit"},
	})

	if err != nil {
		return fmt.Errorf("could not start playwright: %v", err)
	}

	pw, err := playwright.Run(&playwright.RunOptions{})

	if err != nil {
		return fmt.Errorf("could not start playwright: %v", err)
	}

	headless := new(bool)

	*headless = false

	device := pw.WebKit

	browser, err := device.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: headless,
	})

	if err != nil {
		return fmt.Errorf("could not launch browser: %v", err)
	}

	page, err := browser.NewPage(playwright.BrowserNewContextOptions{})

	if err != nil {
		return fmt.Errorf("could not create page: %v", err)
	}

	instanceResourcesFs, err := fs.Sub(resourcesFs, "resources/"+id)

	if err != nil {
		return fmt.Errorf("invalid static files: %v", err)
	}

	wg := &sync.WaitGroup{}

	wg.Add(2)

	var srv *http.Server

	context := context.TODO()

	if len(static) > 0 {
		srv, err = StartStaticFilesHttpServer(url, instanceResourcesFs, wg.Done)

		if err != nil {
			return err
		}
	}

	if _, err = page.Goto(url); err != nil {
		return fmt.Errorf("could not goto: %v", err)
	}

	page.On("close", func() {
		err = srv.Shutdown(context)

		wg.Done()

		wg.Wait()
	})

	wg.Wait()

	return err
}
