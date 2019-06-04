import { Import } from '../interfaces';

import { Utils } from '../utils';
import { BaseCSV } from './base_csv';

export class CSV extends BaseCSV implements Import {

	protected importMapping: any = {
		title: 'title',
		shortDescription: 'short_description',
		longDescription: 'long_description',
		category: {
			field: 'category',
			translate: async (catagory: string) => {
				return await Utils.searchCategories(catagory);
			}
		},
		basePrice: 'base_price',
		domesticShippingPrice: 'domestic_shipping_price',
		internationalShippingPrice: 'international_shipping_price',
		images: {
			field: 'images',
			translate: async (images: string) => {
				return await Utils.getImagesFromList(images);
			}
		}
	}

	getImportParams() {
		return {
			id: 'csv-import',
			name: 'CSV Import',
			networks: ['mainnet', 'testnet'],
			description: 'Populate the marketplace from a csv',
			params: [
				{
					name: 'file',
					type: 'file',
					fileType: '.csv',
					message: 'CSV file to import',
					default: '',
					mandatory: true
				}
			]
		}
	}
}