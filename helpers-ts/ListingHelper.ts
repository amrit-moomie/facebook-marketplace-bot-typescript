class ListingHelper {
    scraper: any;

    constructor(scraper: any) {
        this.scraper = scraper;
    }

    updateListings(listings: any[], type: string): void {
        if (!listings || listings.length === 0) return;

        listings.forEach(listing => {
            this.removeListing(listing, type);
            this.publishListing(listing, type);
        });
    }

    removeListing(data: any, listingType: string): void {
        const title = this.generateTitleForListingType(data, listingType);
        const listingTitle = this.findListingByTitle(title);

        if (!listingTitle) return;

        listingTitle.click();
        this.scraper.elementClick('div:not([role="gridcell"]) > div[aria-label="Delete"][tabindex="0"]');

        const confirmDeleteSelector = 'div[aria-labelledby=":rvf:"] div[aria-label="Delete"][tabindex="0"]';
        if (this.scraper.findElement(confirmDeleteSelector, false, 3)) {
            this.scraper.elementClick(confirmDeleteSelector);
        }

        this.scraper.elementWaitToBeInvisible('div[aria-label="Your Listing"]');
    }

    publishListing(data: any, listingType: string): void {
        this.scraper.elementClick('div[aria-label="Marketplace sidebar"] a[aria-label="Create new listing"]');
        this.scraper.elementClick(`a[href="/marketplace/create/${listingType}/"]`);

        const imagesPath = this.generateMultipleImagesPath(data['Photos Folder'], data['Photos Names']);
        this.scraper.inputFileAddFiles('input[accept="image/*"]', imagesPath);

        this.scraper.elementClick('button[aria-label="Publish"]');
        this.scraper.elementWaitToBeInvisible('div[role="dialog"]');
    }

    findListingByTitle(title: string): any {
        const searchInput = this.scraper.findElement('input[placeholder="Search your listings"]', false);
        if (!searchInput) return null;

        this.scraper.elementDeleteText('input[placeholder="Search your listings"]');
        this.scraper.elementSendKeys('input[placeholder="Search your listings"]', title);

        return this.scraper.findElementByXpath(`//span[text()="${title}"]`, false, 10);
    }

    // Helper methods for title and images (stubs, assume similar to Python logic)
    generateTitleForListingType(data: any, listingType: string): string {
        // Assume some logic to generate title
        return `${listingType} - ${data.title}`;
    }

    generateMultipleImagesPath(folder: string, fileNames: string[]): string {
        // Assume logic to concatenate paths
        return fileNames.map(fileName => `${folder}/${fileName}`).join('\n');
    }
}
