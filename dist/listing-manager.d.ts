import { ListingTemplate } from "./interfaces";
import { Observable } from "rxjs";
export declare class ListingManager {
    static publish(listings: ListingTemplate[], country: string, expTime: number): Observable<any>;
    static validate(listings: ListingTemplate[], country?: string, expTime?: number): Observable<any>;
    private static createListingTemplate;
    private static getTemplate;
    private static sizeTemplate;
    private static removeTemplate;
    private static postTemplate;
}
