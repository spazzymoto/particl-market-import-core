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
			if (imagePath.startsWith('https://') || imagePath.startsWith('http://')) {
				images.push(this.getImageFromURL(imagePath));
			} else {
				images.push(this.getImageFromPath(imagePath));
			}
		}
		return await Promise.all(images);
	}

	private static getImageFromURL(url: string): Promise<string> {
		return got(url, {
			encoding: null
		})
		.then((response: any) => {
			return this.processImage(response.body)
		});
	}

	private static getImageFromPath(path: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(path, null, (err, image) => {
				resolve(this.processImage(image));
			});
		});
	}

	private static async processImage(image: Buffer): Promise<string> {
		try {
			image = await Utils.convertToJPEG(image);
			image = await Utils.resizeImageToFit(image, 800, 800);
		} catch (e) {}

		return `data:image/jpeg;base64,${image.toString('base64')}`;
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
				const result = await MarketRPC.call('category', ['search', category]);
				if (result && result[0]) {
					return resolve({
						id: result[0].id,
						name: result[0].name
					});
				}
				return resolve(null);
			} catch (e) {
				reject(e);
			}
		});
	}
}