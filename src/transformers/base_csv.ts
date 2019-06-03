import { ListingTemplate } from '../interfaces';

import csv from 'csvtojson';
import fs from 'fs';

export abstract class BaseCSV {

  protected importParams: any;

	async load(params: any) {
    this.importParams = params;

		const listings: ListingTemplate[] = [];

		const text = await fs.readFileSync(params.file, "utf8");
		const csvData = await csv().fromString(text);

		if (csvData.length === 0) {
			return listings;
		}

		this.checkImportMapping(csvData);

    for (const item of csvData) {
      const transformed: any = {};
      for (const key in this.importMapping) {
        let mappedKey;
        let transformFunction;

        switch (typeof this.importMapping[key]) {
          case 'string': 
            mappedKey = this.importMapping[key];
            break;
          
          case 'object':
            mappedKey = this.importMapping[key].field;
            transformFunction = this.importMapping[key].translate
            break;

        }
        
        if (mappedKey) {
          transformed[key] = transformFunction ? await transformFunction(item[mappedKey]) : item[mappedKey];
        } else {
          transformed[key] = undefined;
        }
        
      }

      listings.push(<ListingTemplate>transformed);
    }
		

		return listings;
	}

	private checkImportMapping(data: any[]) {

		const testData = data[0];

    for (const key in this.importMapping) {

			if (this.importMapping.hasOwnProperty(key)) {
        let mappedKey;

        switch (typeof this.importMapping[key]) {
          case 'string': 
            mappedKey = this.importMapping[key];
            break;
          
          case 'object':
            mappedKey = this.importMapping[key].field;
            break;

          // Assume undefined here means the user will have to provide as it doesnt exist in cvs
          case 'undefined':
            continue;
        }
					
        if (!testData.hasOwnProperty(mappedKey)) {
          throw new Error(`Unable to find field ${mappedKey} in csv file.`)
        }
      }
    }
  }
  
  protected abstract importMapping: any;

  protected getimportParam(name: string) {
    return this.importParams[name];
  }
}