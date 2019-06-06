import { ListingTemplate } from "./interfaces";
import { MarketRPC } from "./market-rpc";

export class ListingManager {

  static async publish(listings: ListingTemplate[], country: string, expTime: number) {

    for (let index = 0; index < listings.length; index++) {
      const listing = listings[index];

      listing.validationError = '';

      if (!listing.publish) {
        continue
      }

      let template;
      try {
        template = await this.createListingTemplate(listing, country);

        await this.postTemplate(template, 1, expTime);

        listings.splice(index, 1);
      } catch (e) {
        console.log('################### ERROR', e);
        listing.validationError = e.body.error;

        if (template) {
          await this.removeTemplate(template.id);
        }
      }
    }

    return listings;
  }

  static async validate(listings: ListingTemplate[], country?: string, expTime?: number) {
    for (const listing of listings) {
      listing.validationError = '';

      if (!listing.publish) {
        continue;
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

      if (!(listing.basePrice > 0)) {
        missing += 'price per item, '
      }

      if (!(listing.domesticShippingPrice > 0)) {
        missing += 'domestic shipping price, '
      }

      if (!(listing.internationalShippingPrice > 0)) {
        missing += 'international shipping price, '
      }

      if (!listing.category) {
        missing += 'category, '
      }

      if (missing) {
        missing = missing.substring(0, missing.length-2);
        listing.validationError = `The following fields are missing ${missing}. Please correct these before publishing.`;
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

    return listings;
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
      +listing.basePrice,
      +listing.domesticShippingPrice,
      +listing.internationalShippingPrice
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
    
      const escrowParams = [
        'escrow',
        'add',
        template.id,
        'MAD',
        100,
        100
      ];

      await MarketRPC.call('template', escrowParams);

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