/// <reference types="node" />
export declare class Utils {
    static getImagesFromList(imageList: string): Promise<string[]>;
    static convertToJPEG(imageBuffer: Buffer): Promise<Buffer>;
    static resizeImageToFit(imageBuffer: Buffer, maxWidth: number, maxHeight: number): Promise<Buffer>;
}
