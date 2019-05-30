export interface Import {
    load(params: any): Promise<ListingTemplate[]>;
    getImportParams(): any;
}
export interface ListingTemplate {
    title: string;
    shortDescription: string;
    longDescription: string;
    category: number;
    basePrice: number;
    domesticShippingPrice: number;
    internationalShippingPrice: number;
    images: string[];
    publish: boolean;
}
