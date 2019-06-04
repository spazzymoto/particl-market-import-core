/// <reference types="node" />
import { Category } from './interfaces';
export declare class Utils {
    static getImagesFromList(imageList: string): Promise<string[]>;
    static convertToJPEG(imageBuffer: Buffer): Promise<Buffer>;
    static resizeImageToFit(imageBuffer: Buffer, maxWidth: number, maxHeight: number): Promise<Buffer>;
    static searchCategories(category: string): Promise<Category | null>;
}
