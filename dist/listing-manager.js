"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var market_rpc_1 = require("./market-rpc");
var ListingManager = /** @class */ (function () {
    function ListingManager() {
    }
    ListingManager.validate = function (listings, country, expTime) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, listings_1, listing, missing, templateId, templateSize, feeEstimate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, listings_1 = listings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < listings_1.length)) return [3 /*break*/, 9];
                        listing = listings_1[_i];
                        listing.validationError = '';
                        if (!listing.publish) {
                            return [3 /*break*/, 8];
                        }
                        missing = '';
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
                            return [3 /*break*/, 8];
                        }
                        if (!(country && expTime)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.createListingTemplate(listing, country)];
                    case 2:
                        templateId = _a.sent();
                        return [4 /*yield*/, this.sizeTemplate(templateId)];
                    case 3:
                        templateSize = _a.sent();
                        if (!!templateSize.fits) return [3 /*break*/, 4];
                        listing.validationError = 'The listing is to big, please remove some text and/or images.';
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.postTemplate(templateId, 1, expTime, true)];
                    case 5:
                        feeEstimate = _a.sent();
                        listing.fee = +feeEstimate.fee;
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.removeTemplate(templateId)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, listings];
                }
            });
        });
    };
    ListingManager.createListingTemplate = function (listing, country) {
        return __awaiter(this, void 0, void 0, function () {
            var templateParams, template, e_1, locationParams, e_2, escrowParams, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        templateParams = [
                            'add',
                            1,
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', templateParams)];
                    case 2:
                        template = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4:
                        locationParams = [
                            'location',
                            'add',
                            template.id,
                            country,
                            'a'
                        ];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 9]);
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', locationParams)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        e_2 = _a.sent();
                        return [4 /*yield*/, this.removeTemplate(template.id)];
                    case 8:
                        _a.sent();
                        throw e_2;
                    case 9:
                        escrowParams = [
                            'escrow',
                            'add',
                            template.id,
                            'MAD',
                            100,
                            100
                        ];
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 14]);
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', escrowParams)];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        e_3 = _a.sent();
                        return [4 /*yield*/, this.removeTemplate(template.id)];
                    case 13:
                        _a.sent();
                        throw e_3;
                    case 14: 
                    // try {
                    //   await MarketRPC.uploadImage(template.id, listing.images);
                    // } catch (e) {
                    //   await this.removeTemplate(template.id);
                    //   throw e;
                    // }
                    return [2 /*return*/, template.id];
                }
            });
        });
    };
    ListingManager.sizeTemplate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, market_rpc_1.MarketRPC.call('template', ['size', id])];
            });
        });
    };
    ListingManager.removeTemplate = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', ['remove', id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListingManager.postTemplate = function (template, marketId, expTime, estimateFee) {
        if (estimateFee === void 0) { estimateFee = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, market_rpc_1.MarketRPC.call('template', ['post', template.id, expTime, marketId, estimateFee])];
            });
        });
    };
    return ListingManager;
}());
exports.ListingManager = ListingManager;
