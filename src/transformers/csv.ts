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
		basePrice: {
			field: 'base_price',
			translate: Utils.convertToFloat
		},
		domesticShippingPrice: {
			field: 'domestic_shipping_price',
			translate: Utils.convertToFloat
		},
		internationalShippingPrice: {
			field: 'international_shipping_price',
			translate: Utils.convertToFloat
		},
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