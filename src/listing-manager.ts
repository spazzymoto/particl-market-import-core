import { ListingTemplate } from "./interfaces";
import { MarketRPC } from "./market-rpc";

export class ListingManager {

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
        const templateId = await this.createListingTemplate(listing, country);
        const templateSize = await this.sizeTemplate(templateId);

        if (!templateSize.fits) {
          listing.validationError = 'The listing is to big, please remove some text and/or images.';
        } else {
          const feeEstimate = await this.postTemplate(templateId, 1, expTime, true);
          listing.fee = +feeEstimate.fee;
        }

        await this.removeTemplate(templateId);
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
      listing.category,
      'SALE',
      'PARTICL',
      listing.basePrice,
      listing.domesticShippingPrice,
      listing.internationalShippingPrice
    ];
    
    let template;
    try {
      template = await MarketRPC.call('template', templateParams);
    } catch (e) {
      throw e;
    }

    const locationParams = [
      'location',
      'add',
      template.id,
      country,
      'a'
    ];

    try {
      await MarketRPC.call('template', locationParams);
    } catch (e) {
      await this.removeTemplate(template.id);
      throw e;
    }

    const escrowParams = [
      'escrow',
      'add',
      template.id,
      'MAD',
      100,
      100
    ];

    try {
      await MarketRPC.call('template', escrowParams);
    } catch (e) {
      await this.removeTemplate(template.id);
      throw e;
    }

    // try {
    //   await MarketRPC.uploadImage(template.id, listing.images);
    // } catch (e) {
    //   await this.removeTemplate(template.id);
    //   throw e;
    // }

    return template.id;
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