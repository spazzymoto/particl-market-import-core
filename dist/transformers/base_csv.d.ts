import { Observable } from 'rxjs';
export declare abstract class BaseCSV {
    protected importParams: any;
    load(params: any): Observable<any>;
    private checkImportMapping;
    protected abstract importMapping: any;
    protected getimportParam(name: string): any;
}
