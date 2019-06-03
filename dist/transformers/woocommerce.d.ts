import { Import } from '../interfaces';
import { BaseCSV } from './base_csv';
export declare class Woocommerce extends BaseCSV implements Import {
    protected importMapping: any;
    getImportParams(): {
        id: string;
        name: string;
        networks: string[];
        description: string;
        params: ({
            name: string;
            type: string;
            fileType: string;
            message: string;
            default: string;
            mandatory: boolean;
        } | {
            name: string;
            type: string;
            message: string;
            default: string;
            mandatory: boolean;
            fileType?: undefined;
        })[];
    };
}
