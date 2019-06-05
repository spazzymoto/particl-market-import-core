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
var utils_1 = require("../utils");
var got = require('got');
var cheerio = require('cheerio');
var EbayTestnetScraper = /** @class */ (function () {
    function EbayTestnetScraper() {
        this.BASE_PRICES = [0.5, 1, 1.5, 2];
        this.BASE_SHIPPING_PRICES = [0.2, 0.4];
    }
    EbayTestnetScraper.prototype.load = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, listings, category, errorCount, response, e_1, $, productTitle, productDesc, image, nextLinks, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        params.listings_to_scrape = params.listings_to_scrape || 10;
                        url = 'https://ebay.com';
                        listings = [];
                        return [4 /*yield*/, utils_1.Utils.searchCategories('Other')];
                    case 1:
                        category = _d.sent();
                        errorCount = 0;
                        _d.label = 2;
                    case 2:
                        if (!(listings.length < params.listings_to_scrape)) return [3 /*break*/, 11];
                        response = void 0;
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, got(url)];
                    case 4:
                        response = _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _d.sent();
                        if (errorCount > 10) {
                            return [3 /*break*/, 11];
                        }
                        errorCount++;
                        return [3 /*break*/, 2];
                    case 6:
                        errorCount = 0;
                        $ = cheerio.load(response.body);
                        productTitle = $('#itemTitle').text().replace('Details about', '').trim();
                        productDesc = $('#viTabs_0_is table').text().trim();
                        image = $('#icImg').attr('src');
                        nextLinks = void 0;
                        if (!productTitle) return [3 /*break*/, 8];
                        _b = (_a = listings).push;
                        _c = {
                            title: productTitle,
                            shortDescription: 'Created on ' + new Date().toString(),
                            longDescription: productDesc ? productDesc.replace(/  /g, '').replace(/\t/g, '').replace(/\n/g, '') : productTitle,
                            category: category,
                            basePrice: this.BASE_PRICES[Math.floor(Math.random() * this.BASE_PRICES.length)],
                            domesticShippingPrice: this.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this.BASE_SHIPPING_PRICES.length)],
                            internationalShippingPrice: this.BASE_SHIPPING_PRICES[Math.floor(Math.random() * this.BASE_SHIPPING_PRICES.length)] * 2
                        };
                        return [4 /*yield*/, utils_1.Utils.getImagesFromList(image)];
                    case 7:
                        _b.apply(_a, [(_c.images = _d.sent(),
                                _c.publish = true,
                                _c)]);
                        nextLinks = $('.mfe-reco-link');
                        return [3 /*break*/, 9];
                    case 8:
                        nextLinks = $('.hl-item__link');
                        _d.label = 9;
                    case 9:
                        if (nextLinks.length === 0) {
                            url = 'https://ebay.com';
                        }
                        else {
                            url = $(nextLinks[Math.floor(Math.random() * nextLinks.length)]).attr('href');
                        }
                        // Lets scrape responsibly
                        return [4 /*yield*/, this.sleep(1000)];
                    case 10:
                        // Lets scrape responsibly
                        _d.sent();
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/, listings];
                }
            });
        });
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
