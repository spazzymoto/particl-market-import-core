export declare class MarketRPC {
    static call(method: string, params?: Array<any> | null): Promise<any>;
    static uploadImages(templateId: number, base64DataURIArray: any[]): Promise<{}>;
    private static extractMPErrorMessage;
}
