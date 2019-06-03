import { ListingTemplate } from '../interfaces';
export declare abstract class BaseCSV {
    protected importParams: any;
    load(params: any): Promise<ListingTemplate[]>;
    private checkImportMapping;
    protected abstract importMapping: any;
    protected getimportParam(name: string): any;
}
