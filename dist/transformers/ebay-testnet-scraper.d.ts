import { Import } from '../interfaces';
import { Observable } from 'rxjs';
export declare class EbayTestnetScraper implements Import {
    private BASE_PRICES;
    private BASE_SHIPPING_PRICES;
    load(params: any): Observable<any>;
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
