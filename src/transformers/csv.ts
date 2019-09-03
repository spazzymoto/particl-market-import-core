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
			name: 'CSV file',
			networks: ['mainnet', 'testnet'],
			description: 'Import your products from a CSV file',
			params: [
				{
					name: 'file',
					type: 'file',
					fileType: '.csv',
					message: 'CSV file to import',
					default: '',
					mandatory: true
				},
				{
					name: 'delimiter',
					type: 'text',
					message: 'Value delimiter',
					default: ',',
					mandatory: true
				}
			]
		}
	}
}