
(async () => {
    // Initialize the scraper with the Facebook URL
    const scraper = new Scraper('https://facebook.com');

    // Add login functionality to the scraper
    await scraper.addLoginFunctionality('https://facebook.com', 'svg[aria-label="Your profile"]', 'facebook');
    
    // Navigate to the selling page of the Facebook marketplace
    await scraper.goToPage('https://facebook.com/marketplace/you/selling');

    // Get data for item type listings from csvs/items.csv
    const itemListings = await getDataFromCsv('items');
    
    // Publish all of the items into the Facebook marketplace
    await updateListings(itemListings, 'item', scraper);

    // Get data for vehicle type listings from csvs/vehicles.csv
    const vehicleListings = await getDataFromCsv('vehicles');
    
    // Publish all of the vehicles into the Facebook marketplace
    await updateListings(vehicleListings, 'vehicle', scraper);
})().catch(error => {
    console.error('Error in execution:', error);
});
