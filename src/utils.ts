import fs from 'fs';
import Jimp from 'jimp';
import { MarketRPC } from './market-rpc';
import { Category } from './interfaces';

const got = require('got');

export class Utils {

	static async getImagesFromList(imageList: string) {
		if (imageList.trim() === '') {
			return {type: 'BULK_RESULT', errors: '', result: []};
		}
		const imagePaths = imageList.split(',').map(i => i.trim());
		const result = [];
		let errors = '';
		for (let imagePath of imagePaths) {
			try {
				let imageBuffer: Buffer;
				if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
					const response = await got(imagePath, {
						encoding: null
					});

					imageBuffer = response.body;
				} else {
					imageBuffer = fs.readFileSync(imagePath);
				}

			
				imageBuffer = await Utils.convertToJPEG(imageBuffer);
				imageBuffer = await Utils.resizeImageToFit(imageBuffer, 800, 800);

				result.push(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`);
			} catch (e) {
				let errorMessage = e.message;
				if (e.hasOwnProperty('code')) {
					switch (e.code) {
						case 'ETIMEDOUT':
							errorMessage = 'Request timed out';
							break;
						case 'ECONNRESET':
							errorMessage = 'Connection reset by host';
							break;
						case 'ECONNREFUSED':
							errorMessage = 'Connection refused by host';
							break;
						case 'ENOTFOUND':
							errorMessage = 'URL not found';
							break;
						case 'ENETUNREACH':
							errorMessage = 'No internet connection';
							break;
					}
				}

				const msg = `\t${errorMessage} ("${imagePath}")`;
				errors += (errors === '') ? msg : `\n${msg}`;
			}
		}
		return {type: 'BULK_RESULT', errors, result};
	}

	static async convertToJPEG(imageBuffer: Buffer): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			try {
				const image = await Jimp.read(imageBuffer);

				if (image.getMIME() !== 'image/jpeg') {
					image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
						if (err) {
							return reject(err);
						}
						resolve(buffer);
					});
				} else {
					resolve(imageBuffer);
				}
			} catch (e) {
				return reject(e);
			}
		});
	}

	static async resizeImageToFit(imageBuffer: Buffer, maxWidth: number, maxHeight: number): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			try {
				const image: any = await Jimp.read(imageBuffer);
				if (maxWidth > 0 && maxHeight > 0 && ( (image.bitmap.width > maxWidth) || (image.bitmap.height > maxHeight))) {
					image.scaleToFit(maxWidth, maxHeight);
					image.getBuffer(Jimp.MIME_JPEG, (err: any, buffer: any) => {
						if (err) {
							return reject(err);
						}
						resolve(buffer);
					});
				} else {
					resolve(imageBuffer);
				}
			} catch (e) {
				return reject(e);
			}
		});
	}

	static async searchCategories(category: string): Promise<Category | undefined> {
		return new Promise(async (resolve, reject) => {
			if (category.trim() === '') {
				return resolve(undefined);
			}
			try {
				const results = await MarketRPC.call('category', ['search', category]);
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					if (result.parentItemCategoryId !== null && result.parentItemCategoryId !== 1) {
						return resolve(result);
					}
				}
				return resolve(undefined);
			} catch (e) {
				reject(e);
			}
		});
	}

	static convertToFloat(value: string) {
		let float = parseFloat(value);
		if (isNaN(float)) {
			throw new Error(`Invalid number: ${value}`)
		}
		return float;
	}
}
