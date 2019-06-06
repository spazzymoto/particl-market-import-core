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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var market_rpc_1 = require("./market-rpc");
var rxjs_1 = require("rxjs");
var _ = __importStar(require("lodash"));
var ListingManager = /** @class */ (function () {
    function ListingManager() {
    }
    ListingManager.publish = function (listings, country, expTime) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) { return __awaiter(_this, void 0, void 0, function () {
            var listingsToProcess, currentListing, _i, listings_1, listing, template, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listingsToProcess = _.chain(listings).filter(function (l) { return l.publish; }).size().value();
                        currentListing = 1;
                        _i = 0, listings_1 = listings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < listings_1.length)) return [3 /*break*/, 9];
                        listing = listings_1[_i];
                        if (!listing.publish) {
                            return [3 /*break*/, 8];
                        }
                        listing.validationError = '';
                        observer.next({ status: "Hang on, we are busy publishing listing " + currentListing++ + "/" + listingsToProcess });
                        template = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 8]);
                        return [4 /*yield*/, this.createListingTemplate(listing, country)];
                    case 3:
                        template = _a.sent();
                        return [4 /*yield*/, this.postTemplate(template, 1, expTime)];
                    case 4:
                        _a.sent();
                        listing.id = template.id;
                        return [3 /*break*/, 8];
                    case 5:
                        e_1 = _a.sent();
                        listing.validationError = e_1.body.error;
                        if (!template) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.removeTemplate(template.id)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9:
                        observer.next({ result: listings });
                        observer.complete();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ListingManager.validate = function (listings, country, expTime) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) { return __awaiter(_this, void 0, void 0, function () {
            var listingsToProcess, currentListing, _i, listings_2, listing, missing, template, templateSize, feeEstimate, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listingsToProcess = _.chain(listings).filter(function (l) { return l.publish; }).size().value();
                        currentListing = 1;
                        _i = 0, listings_2 = listings;
                        _a.label = 1;
                    case 1:
                        if (!(_i < listings_2.length)) return [3 /*break*/, 13];
                        listing = listings_2[_i];
                        if (!listing.publish) {
                            return [3 /*break*/, 12];
                        }
                        listing.validationError = '';
                        if (country && expTime) {
                            observer.next({ status: "Hang on, we are busy estimating the fee for listing " + currentListing++ + "/" + listingsToProcess });
                        }
                        else {
                            observer.next({ status: "Hang on, we are busy validating listing " + currentListing++ + "/" + listingsToProcess });
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
                            return [3 /*break*/, 12];
                        }
                        if (!(country && expTime)) return [3 /*break*/, 12];
                        template = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, 9, 12]);
                        return [4 /*yield*/, this.createListingTemplate(listing, country)];
                    case 3:
                        template = _a.sent();
                        return [4 /*yield*/, this.sizeTemplate(template.id)];
                    case 4:
                        templateSize = _a.sent();
                        if (!!templateSize.fits) return [3 /*break*/, 5];
                        listing.validationError = 'The listing is to big, please remove some text and/or images.';
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.postTemplate(template, 1, expTime, true)];
                    case 6:
                        feeEstimate = _a.sent();
                        listing.fee = +feeEstimate.fee;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        e_2 = _a.sent();
                        listing.validationError = e_2.body.error;
                        return [3 /*break*/, 12];
                    case 9:
                        if (!template) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.removeTemplate(template.id)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        _i++;
                        return [3 /*break*/, 1];
                    case 13:
                        observer.next({ result: listings });
                        observer.complete();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ListingManager.createListingTemplate = function (listing, country) {
        return __awaiter(this, void 0, void 0, function () {
            var templateParams, template, e_3, locationParams, escrowParams, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        templateParams = [
                            'add',
                            1,
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', templateParams)];
                    case 2:
                        template = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        throw e_3;
                    case 4:
                        _a.trys.push([4, 8, , 10]);
                        locationParams = [
                            'location',
                            'add',
                            template.id,
                            country,
                            'a'
                        ];
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', locationParams)];
                    case 5:
                        _a.sent();
                        escrowParams = [
                            'escrow',
                            'add',
                            template.id,
                            'MAD',
                            100,
                            100
                        ];
                        return [4 /*yield*/, market_rpc_1.MarketRPC.call('template', escrowParams)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, market_rpc_1.MarketRPC.uploadImages(template.id, listing.images)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        e_4 = _a.sent();
                        return [4 /*yield*/, this.removeTemplate(template.id)];
                    case 9:
                        _a.sent();
                        throw e_4;
                    case 10: return [2 /*return*/, this.getTemplate(template.id)];
                }
            });
        });
    };
    ListingManager.getTemplate = function (id, returnImageData) {
        if (returnImageData === void 0) { returnImageData = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, market_rpc_1.MarketRPC.call('template', ['get', id, returnImageData])];
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
