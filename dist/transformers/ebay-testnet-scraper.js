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
var utils_1 = require("../utils");
var rxjs_1 = require("rxjs");
var _ = __importStar(require("lodash"));
var got = require('got');
var cheerio = require('cheerio');
var EbayTestnetScraper = /** @class */ (function () {
    function EbayTestnetScraper() {
        this.BASE_PRICES = [0.5, 1, 1.5, 2];
        this.BASE_SHIPPING_PRICES = [0.2, 0.4];
    }
    EbayTestnetScraper.prototype.load = function (params) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) { return __awaiter(_this, void 0, void 0, function () {
            var url, listings, category, errorCount, _loop_1, this_1, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params.listings_to_scrape = params.listings_to_scrape || 10;
                        url = 'https://ebay.com';
                        listings = [];
                        return [4 /*yield*/, utils_1.Utils.searchCategories('Other')];
                    case 1:
                        category = _a.sent();
                        errorCount = 0;
                        _loop_1 = function () {
                            var response, e_1, $, productTitle, productDesc, image, nextLinks, _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        response = void 0;
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, got(url)];
                                    case 2:
                                        response = _d.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_1 = _d.sent();
                                        if (errorCount > 10) {
                                            return [2 /*return*/, "break"];
                                        }
                                        errorCount++;
                                        return [2 /*return*/, "continue"];
                                    case 4:
                                        errorCount = 0;
                                        $ = cheerio.load(response.body);
                                        productTitle = $('#itemTitle').text().replace('Details about', '').trim();
                                        productDesc = $('#viTabs_0_is table').text().trim();
                                        image = $('#icImg').attr('src');
                                        nextLinks = void 0;
                                        if (!productTitle) return [3 /*break*/, 7];
                                        if (!!_.find(listings, function (l) { return l.title === productTitle; })) return [3 /*break*/, 6];
                                        _b = (_a = listings).push;
                                        _c = {
                                            title: productTitle,
                                            shortDescription: 'Created on ' + new Date().toString(),
                                            longDescription: productDesc ? productDesc.replace(/  /g, '').replace(/\t/g, '').replace(/\n/g, '') : productTitle,
                                            category: category,
                                            basePrice: this_1.BASE_PRICES[Math.floor(Math.random() * this_1.BASE_PRICES.length)],
                                            domesticShippingPrice: this_1.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this_1.BASE_SHIPPING_PRICES.length)],
                                            internationalShippingPrice: this_1.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this_1.BASE_SHIPPING_PRICES.length)] * 2
                                        };
                                        return [4 /*yield*/, utils_1.Utils.getImagesFromList(image)];
                                    case 5:
                                        _b.apply(_a, [(_c.images = _d.sent(),
                                                _c.publish = true,
                                                _c)]);
                                        observer.next({ status: "importing " + listings.length + "/" + params.listings_to_scrape });
                                        _d.label = 6;
                                    case 6:
                                        nextLinks = $('.mfe-reco-link');
                                        return [3 /*break*/, 8];
                                    case 7:
                                        nextLinks = $('.hl-item__link');
                                        _d.label = 8;
                                    case 8:
                                        if (nextLinks.length === 0) {
                                            url = 'https://ebay.com';
                                        }
                                        else {
                                            url = $(nextLinks[Math.floor(Math.random() * nextLinks.length)]).attr('href');
                                        }
                                        // Lets scrape responsibly
                                        return [4 /*yield*/, this_1.sleep(500)];
                                    case 9:
                                        // Lets scrape responsibly
                                        _d.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        if (!(listings.length < params.listings_to_scrape)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        state_1 = _a.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 4];
                        return [3 /*break*/, 2];
                    case 4:
                        observer.next({ result: listings });
                        observer.complete();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    EbayTestnetScraper.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    EbayTestnetScraper.prototype.getImportParams = function () {
        return {
            id: 'ebay-testnet-scraper',
            name: 'Ebay Testnet Scraper',
            networks: ['testnet'],
            description: 'Populate the marketplace by scraping ebay (Testing purposes)',
            params: [{
                    name: 'listings_to_scrape',
                    type: 'number',
                    message: 'Number of products to scrape',
                    default: 10,
                    mandatory: false
                }]
        };
    };
    return EbayTestnetScraper;
}());
exports.EbayTestnetScraper = EbayTestnetScraper;
