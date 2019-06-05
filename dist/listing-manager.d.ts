import { ListingTemplate } from "./interfaces";
export declare class ListingManager {
    static publish(listings: ListingTemplate[], country: string, expTime: number): Promise<ListingTemplate[]>;
    static validate(listings: ListingTemplate[], country?: string, expTime?: number): Promise<ListingTemplate[]>;
    private static createListingTemplate;
    private static getTemplate;
    private static sizeTemplate;
    private static removeTemplate;
    private static postTemplate;
}
