"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListingManager = /** @class */ (function () {
    function ListingManager() {
    }
    ListingManager.validate = function (listings) {
        for (var _i = 0, listings_1 = listings; _i < listings_1.length; _i++) {
            var listing = listings_1[_i];
            listing.validationError = '';
            if (!listing.publish) {
                continue;
            }
            var missing = '';
            if (!listing.title.trim()) {
                missing += 'title, ';
            }
            if (!listing.shortDescription.trim()) {
                missing += 'short description, ';
            }
            if (!listing.longDescription.trim()) {
                missing += 'long description, ';
            }
            if (!(listing.basePrice > 0)) {
                missing += 'price per item, ';
            }
            if (!(listing.domesticShippingPrice > 0)) {
                missing += 'domestic shipping price, ';
            }
            if (!(listing.internationalShippingPrice > 0)) {
                missing += 'international shipping price, ';
            }
            if (!listing.category) {
                missing += 'category, ';
            }
            if (missing) {
                missing = missing.substring(0, missing.length - 2);
                listing.validationError = "The following fields are missing " + missing + ". Please correct these before publishing.";
            }
            // Due to needing the listing template created for size estimate, ill check that when publishing :(
        }
        return listings;
    };
    return ListingManager;
}());
exports.ListingManager = ListingManager;
