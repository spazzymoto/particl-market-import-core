import { ListingTemplate } from "./interfaces";
import { MarketRPC } from "./market-rpc";
import { Observable } from "rxjs";

import * as _ from 'lodash';

export class ListingManager {

  static publish(listings: ListingTemplate[], country: string, expTime: number): Observable<any> {
    return Observable.create(async (observer: any) => {
    
      const listingsToProcess = _.chain(listings).filter(l => l.publish).size().value();
      let currentListing = 1;

      for (const listing of listings) {
        
        if (!listing.publish) {
          continue
        }

        listing.validationError = '';

        observer.next({status: `Hang on, we are busy publishing listing ${currentListing++}/${listingsToProcess}`});

        let template;
        try {
          template = await this.createListingTemplate(listing, country);

          await this.postTemplate(template, 1, expTime);

          listing.id = template.id;
        } catch (e) {
          listing.validationError = e.body.error;

          if (template) {
            await this.removeTemplate(template.id);
          }
        }
      }

      observer.next({result: listings});
			observer.complete();
    });
  }

  static validate(listings: ListingTemplate[], country?: string, expTime?: number): Observable<any> {
    return Observable.create(async (observer: any) => {
    
      const listingsToProcess = _.chain(listings).filter(l => l.publish).size().value();
      let currentListing = 1;

      for (const listing of listings) {
        
        if (!listing.publish) {
          continue;
        }

        listing.validationError = '';

        if (country && expTime) {
          observer.next({status: `Hang on, we are busy estimating the fee for listing ${currentListing++}/${listingsToProcess}`});
        } else {
          observer.next({status: `Hang on, we are busy validating listing ${currentListing++}/${listingsToProcess}`});
        }

        let missing = '';

        if (!listing.title.trim()) {
          missing += 'title, '
        }

        if (!listing.shortDescription.trim()) {
          missing += 'short description, '
        }

        if (!listing.longDescription.trim()) {
          missing += 'long description, '
        }

        if (listing.basePrice < 0) {
          missing += 'price per item, '
        }

        if (listing.domesticShippingPrice < 0) {
          missing += 'domestic shipping price, '
        }

        if (listing.internationalShippingPrice < 0) {
          missing += 'international shipping price, '
        }

        if (!listing.category) {
          missing += 'category, '
        }

        const minShipping = Math.min(listing.domesticShippingPrice, listing.internationalShippingPrice);
        if (listing.basePrice + minShipping < 0.0001) {
          listing.validationError = 'Combined total cost (Listing Price + Lowest Shipping) cannot be less than 0.0001.';
        }

        if (missing) {
          missing = missing.substring(0, missing.length-2);
          listing.validationError = (listing.validationError != '' ? listing.validationError + '\n' : '') + `The following fields are missing ${missing}. Please correct these before publishing.`;
          continue;
        }

        if (country && expTime) {
          let template;
          try {
            template = await this.createListingTemplate(listing, country);

            const templateSize = await this.sizeTemplate(template.id);

            if (!templateSize.fits) {
              listing.validationError = 'The listing is to big, please remove some text and/or images.';
            } else {
              const feeEstimate = await this.postTemplate(template, 1, expTime, true);

              listing.fee = +feeEstimate.fee;
            }
          } catch (e) {
            listing.validationError = e.body.error;
          } finally {
            if (template) {
              await this.removeTemplate(template.id);
            }
          }
        }
        
      }

      observer.next({result: listings});
			observer.complete();
    });
  }

  private static async createListingTemplate(listing: ListingTemplate, country: string) {
    const templateParams = [
      'add',
      1, // profile
      listing.title,
      listing.shortDescription,
      listing.longDescription,
      listing.category.id,
      'SALE',
      'PARTICL',
      +listing.basePrice * 100000000,
      +listing.domesticShippingPrice * 100000000,
      +listing.internationalShippingPrice * 100000000,
      'MAD_CT',
      100,
      100
    ];

    let template;
    try {
      template = await MarketRPC.call('template', templateParams);
    } catch (e) {
      throw e;
    }

    try {
      const locationParams = [
        'location',
        'add',
        template.id,
        country,
        'a'
      ];

    
      await MarketRPC.call('template', locationParams);

      await MarketRPC.uploadImages(template.id, listing.images);

    } catch (e) {
      await this.removeTemplate(template.id);
      throw e;
    }

    return this.getTemplate(template.id);
  }

  private static async getTemplate(id: number, returnImageData: boolean = false) {
    return MarketRPC.call('template', ['get', id, returnImageData]);
  }

  private static async sizeTemplate(id: number) {
    return MarketRPC.call('template', ['size', id]);
  }

  private static async removeTemplate(id: number){
    await MarketRPC.call('template', ['remove', id]);
  }

  private static async postTemplate(template: any, marketId: number, expTime: number, estimateFee: boolean = false){
    return MarketRPC.call('template', ['post', template.id, expTime, marketId, estimateFee])
  }

}