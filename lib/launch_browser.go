package lib

import (
	"fmt"
	"sync"

	"github.com/playwright-community/playwright-go"
)

func LaunchBrowser(
	url string,
) (*sync.WaitGroup, error) {
	browserWaitGroup := &sync.WaitGroup{}

	err := playwright.Install(&playwright.RunOptions{
		Browsers: []string{"webkit"},
	})

	if err != nil {
		return browserWaitGroup, fmt.Errorf("could not start playwright: %v", err)
	}

	pw, err := playwright.Run(&playwright.RunOptions{})

	if err != nil {
		return browserWaitGroup, fmt.Errorf("could not start playwright: %v", err)
	}

	headless := new(bool)

	*headless = false

	device := pw.WebKit

	browser, err := device.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: headless,
	})

	if err != nil {
		return browserWaitGroup, fmt.Errorf("could not launch browser: %v", err)
	}

	page, err := browser.NewPage(playwright.BrowserNewContextOptions{})

	if err != nil {
		return browserWaitGroup, fmt.Errorf("could not create page: %v", err)
	}

	if _, err = page.Goto(url); err != nil {
		return browserWaitGroup, fmt.Errorf("could not goto: %v", err)
	}

	browserWaitGroup.Add(1)

	page.On("close", browserWaitGroup.Done)

	return browserWaitGroup, err
}
