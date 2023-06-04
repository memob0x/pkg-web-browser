package main

import (
	"log"
	"sync"

	"github.com/playwright-community/playwright-go"
)

var url string

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

	if _, err = page.Goto(url); err != nil {
		log.Fatalf("could not goto: %v", err)
	}

	var wg sync.WaitGroup

	wg.Add(1)

	page.On("close", func() {
		wg.Done()
	})

	wg.Wait()
}
