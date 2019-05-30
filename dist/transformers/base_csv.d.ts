import { ListingTemplate } from '../interfaces';
export declare abstract class BaseCSV {
    load(params: any): Promise<ListingTemplate[]>;
    private checkImportMapping;
    protected abstract importMapping: any;
}
