import { Import } from '../interfaces';

import { Utils } from '../utils';
import { BaseCSV } from './base_csv';

export class Woocommerce extends BaseCSV implements Import {

	protected importMapping: any = {
    title: 'Name',
    shortDescription: 'Short description',
    longDescription: 'Description',
    category: 'Categories',
    basePrice: {
      field: 'Regular price',
      translate: (price: string) => {
        return parseFloat(price) * 0.02; // Currency Converter
      }
    },
    domesticShippingPrice: undefined,
    internationalShippingPrice: undefined,
    images: {
      field: 'Images',
      translate: async (images: string) => {
        return await Utils.getImagesFromList(images);
      }
    }
  }

	getImportParams() {
		return {
			id: 'woocommerce-import',
			name: 'Woocommerce Import',
			networks: ['mainnet', 'testnet'],
			description: 'Populate the marketplace from a Woocommerce export',
			params: [
				{
					name: 'file',
					type: 'file',
					fileType: '.csv',
					message: 'Woocommerce export file',
					default: '',
					mandatory: true
				}
			]
		}
	}
}