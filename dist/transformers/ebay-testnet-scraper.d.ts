import { Import } from '../interfaces';
export declare class EbayTestnetScraper implements Import {
    private BASE_PRICES;
    private BASE_SHIPPING_PRICES;
    load(params: any): any;
    private sleep;
    getImportParams(): {
        id: string;
        name: string;
        networks: string[];
        description: string;
        params: {
            name: string;
            type: string;
            message: string;
            default: number;
            mandatory: boolean;
        }[];
    };
}
