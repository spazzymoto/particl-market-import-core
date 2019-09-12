import { ListingTemplate } from '../interfaces';

import csv from 'csvtojson';
import fs from 'fs';
import { Observable } from 'rxjs';

export abstract class BaseCSV {

  protected importParams: any;

	load(params: any): Observable<any> {
    return Observable.create(async (observer: any) => {

      this.importParams = params;

      const listings: ListingTemplate[] = [];

      const text = await fs.readFileSync(params.file, "utf8");
      const csvData = await csv({
        delimiter: params.delimiter || ","
      }).fromString(text);

      if (csvData.length === 0) {
        return listings;
      }

      try {
        this.checkImportMapping(csvData);
      } catch (e) {
        observer.error(e.message);
        observer.complete();
        return;
      }

      for (const item of csvData) {
        observer.next({status: `Hang on, we are busy importing listing ${listings.length + 1}/${csvData.length}`});
        const transformed: any = {
          validationError: ''
        };
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
            if (transformFunction) {
              try {
                const transformResult = await transformFunction(item[mappedKey]);
                
                if (typeof transformResult === 'object' && transformResult.hasOwnProperty('type') && transformResult.type === 'BULK_RESULT') {
                  transformed[key] = transformResult.result;
                  if (transformResult.errors.trim() !== '') {
                    const errorMessage = `Field ${key} had the following error(s):\n${transformResult.errors}`;
                    transformed.validationError += (transformed.validationError === '') ? errorMessage : `\n${errorMessage}`;
                  }
                } else {
                  transformed[key] = transformResult;
                }
              } catch (e) {
                transformed[key] = undefined;
                const errorMessage = `Field ${key} had the following error(s):\n\t${e.message}`;
                transformed.validationError += (transformed.validationError === '') ? errorMessage : `\n${errorMessage}`;
              }
            } else {
              transformed[key] = item[mappedKey];
            }
          } else {
            transformed[key] = undefined;
          }
          
        }
        transformed.publish = true;

        listings.push(<ListingTemplate>transformed);
      }
      
      observer.next({result: listings});
			observer.complete();
    });
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
          throw new Error(`Unable to find the column "${mappedKey}" in csv file.`)
        }
      }
    }
  }
  
  protected abstract importMapping: any;

  protected getimportParam(name: string) {
    return this.importParams[name];
  }
}