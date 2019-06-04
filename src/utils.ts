import fs from 'fs';
import Jimp from 'jimp';
import { MarketRPC } from './market-rpc';
import { Category } from './interfaces';

const got = require('got');

export class Utils {

  static async getImagesFromList(imageList: string) {
		const imagePaths = imageList.split(',').map(i => i.trim());
		const images = [];
		for (let imagePath of imagePaths) {
			let imageBuffer: Buffer;
			if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
				const response = await got(imagePath, {
					encoding: null
				});

				imageBuffer = response.body;
			} else {
				imageBuffer = fs.readFileSync(imagePath);
			}

			try {
				imageBuffer = await Utils.convertToJPEG(imageBuffer);
				imageBuffer = await Utils.resizeImageToFit(imageBuffer, 800, 800);

				images.push(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`);
			} catch (e) {}
		}
		return images;
	}

	static async convertToJPEG(imageBuffer: Buffer): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			try {
				const image = await Jimp.read(imageBuffer);

				if (image.getMIME() !== 'image/jpeg') {
					image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
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

	static async searchCategories(category: string):	Promise<Category | null> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await MarketRPC.call('category', ['search', category]);
				if (response.body.result && response.body.result[0]) {
					return resolve({
						id: response.body.result[0].id,
						name: response.body.result[0].name
					});
				}
				return resolve(null);
			} catch (e) {
				reject(e);
			}
		});
	}
}