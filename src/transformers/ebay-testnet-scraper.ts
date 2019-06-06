import { ListingTemplate, Import } from '../interfaces';
import { Utils } from '../utils';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

const got = require('got');
const cheerio = require('cheerio');

export class EbayTestnetScraper implements Import {
	private BASE_PRICES = [0.5, 1, 1.5, 2];
	private BASE_SHIPPING_PRICES = [0.2, 0.4];
	
	load(params: any): Observable<any> {
		return Observable.create(async (observer: any) => {

			params.listings_to_scrape = params.listings_to_scrape || 10;
			let url = 'https://ebay.com';

			const listings: ListingTemplate[] = [];
			const category = await Utils.searchCategories('Other')
			let errorCount = 0;

			while (listings.length < params.listings_to_scrape) {
				let response;
				
				try {
					response = await got(url);
				} catch(e) {
					if (errorCount > 10) {
						break;
					}
					errorCount++;
					continue;
				}
				errorCount = 0;
				
				const $ = cheerio.load(response.body);

				const productTitle = $('#itemTitle').text().replace('Details about', '').trim();
				const productDesc = $('#viTabs_0_is table').text().trim();
				const image = $('#icImg').attr('src');

				let nextLinks;
				if (productTitle) {
					if (!_.find(listings, l => l.title === productTitle)) {
						observer.next({status: `Hang on, we are busy scraping item ${listings.length + 1}/${params.listings_to_scrape}`});
						listings.push(<ListingTemplate>{
							title: productTitle,
							shortDescription: 'Created on ' + new Date().toString(),
							longDescription: productDesc ? productDesc.replace(/  /g, '').replace(/\t/g, '').replace(/\n/g, '') : productTitle,
							category: category,
							basePrice: this.BASE_PRICES[Math.floor(Math.random() * this.BASE_PRICES.length)],
							domesticShippingPrice: this.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this.BASE_SHIPPING_PRICES.length)],
							internationalShippingPrice: this.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this.BASE_SHIPPING_PRICES.length)] * 2,
							images: await Utils.getImagesFromList(image),
							publish: true
						});
					}

					nextLinks = $('.mfe-reco-link');
				} else {
					nextLinks = $('.hl-item__link');
				}

				if (nextLinks.length === 0) {
					url = 'https://ebay.com';
				} else {
					url = $(nextLinks[Math.floor(Math.random() * nextLinks.length)]).attr('href');
				}

				// Lets scrape responsibly
				await this.sleep(500);
			}

			observer.next({result: listings});
			observer.complete();
		});
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	getImportParams() {
		return {
			id: 'ebay-testnet-scraper',
			name: 'Ebay Testnet Scraper',
			networks: ['testnet'],
			description: 'Populate the marketplace by scraping ebay (Testing purposes)',
			params: [{
				name: 'listings_to_scrape',
				type: 'number',
				message: 'Number of products to scrape',
				default: 10,
				mandatory: false
			}]
		}
	}
}