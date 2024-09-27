import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as fs from 'fs';
import * as path from 'path';

class Scraper {
    private driver: WebDriver;
    private readonly waitElementTime = 30000; // 30 seconds

    constructor(private url: string) {
        this.setupDriverOptions();
        this.setupDriver();
    }

    // Close driver on destruction of the object
    async closeDriver() {
        if (this.driver) {
            await this.driver.quit();
        }
    }

    // Configure ChromeDriver options to bypass bot detection
    setupDriverOptions(): chrome.Options {
        const options = new chrome.Options();
        options.addArguments('--disable-blink-features=AutomationControlled');
        options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 2 });
        return options;
    }

    // Initialize ChromeDriver with the predefined options
    async setupDriver() {
        const options = this.setupDriverOptions();
        this.driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await this.driver.get(this.url);
    }

    // Wait for a random amount of time (between 1 and 3 seconds)
    async waitRandomTime() {
        const randomTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, randomTime));
    }

    // Find element using CSS selector
    async findElement(selector: string) {
        return await this.driver.wait(until.elementLocated(By.css(selector)), this.waitElementTime);
    }

    // Click an element found by selector
    async elementClick(selector: string) {
        try {
            const element = await this.findElement(selector);
            await element.click();
        } catch (error) {
            console.error(`ERROR: Element with selector "${selector}" was not clickable`);
            throw error;
        }
    }

    // Send text to an input element
    async inputSendText(selector: string, text: string) {
        const element = await this.findElement(selector);
        await element.clear();
        await element.sendKeys(text);
    }

    // Upload a file via an input element
    async inputFileAddFiles(selector: string, filePaths: string[]) {
        try {
            const inputFile = await this.findElement(selector);
            const absolutePaths = filePaths.map(filePath => path.resolve(filePath)).join('\n');
            await inputFile.sendKeys(absolutePaths);
        } catch (error) {
            console.error(`ERROR: Unable to upload files. Selector: ${selector}, Files: ${filePaths.join(', ')}`);
            throw error;
        }
    }

    // Scroll to a particular element
    async scrollToElement(selector: string) {
        const element = await this.findElement(selector);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    }

    // Wait for an element to be invisible
    async elementWaitToBeInvisible(selector: string) {
        try {
            await this.driver.wait(until.elementIsNotVisible(await this.findElement(selector)), this.waitElementTime);
        } catch (error) {
            console.error(`ERROR: Element with selector "${selector}" did not become invisible in time`);
            throw error;
        }
    }
}

// Usage Example
(async () => {
    const scraper = new Scraper('https://example.com');
    try {
        await scraper.inputSendText('#input-id', 'Some text');
        await scraper.elementClick('#submit-button');
        await scraper.scrollToElement('#footer');
        // Add other scraping tasks as needed
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await scraper.closeDriver();
    }
})();
