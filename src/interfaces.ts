export interface Import {
  load(params: any): Promise<ListingTemplate[]>;
  getImportParams(): any;
}

export interface Category {
  id: number;
  name: string;
}

export interface ListingTemplate {
  title: string;
  shortDescription: string;
  longDescription: string;
  category: Category;
  basePrice: number;
  domesticShippingPrice: number;
  internationalShippingPrice: number;
  images: string[];
  publish: boolean;
  validationError: string;
  fee: number;
}