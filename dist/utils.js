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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var jimp_1 = __importDefault(require("jimp"));
var market_rpc_1 = require("./market-rpc");
var got = require('got');
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getImagesFromList = function (imageList) {
        return __awaiter(this, void 0, void 0, function () {
            var imagePaths, result, errors, _i, imagePaths_1, imagePath, imageBuffer, response, e_1, errorMessage, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imagePaths = imageList.split(',').map(function (i) { return i.trim(); });
                        result = [];
                        errors = '';
                        _i = 0, imagePaths_1 = imagePaths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < imagePaths_1.length)) return [3 /*break*/, 10];
                        imagePath = imagePaths_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        imageBuffer = void 0;
                        if (!(imagePath.startsWith('https://') || imagePath.startsWith('http://'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, got(imagePath, {
                                encoding: null
                            })];
                    case 3:
                        response = _a.sent();
                        imageBuffer = response.body;
                        return [3 /*break*/, 5];
                    case 4:
                        imageBuffer = fs_1.default.readFileSync(imagePath);
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Utils.convertToJPEG(imageBuffer)];
                    case 6:
                        imageBuffer = _a.sent();
                        return [4 /*yield*/, Utils.resizeImageToFit(imageBuffer, 800, 800)];
                    case 7:
                        imageBuffer = _a.sent();
                        result.push("data:image/jpeg;base64," + imageBuffer.toString('base64'));
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _a.sent();
                        errorMessage = e_1.message;
                        if (e_1.hasOwnProperty('code')) {
                            switch (e_1.code) {
                                case 'ETIMEDOUT':
                                    errorMessage = 'Request timed out';
                                    break;
                                case 'ECONNRESET':
                                    errorMessage = 'Connection reset by host';
                                    break;
                                case 'ECONNREFUSED':
                                    errorMessage = 'Connection refused by host';
                                    break;
                                case 'ENOTFOUND':
                                    errorMessage = 'URL not found';
                                    break;
                                case 'ENETUNREACH':
                                    errorMessage = 'No internet connection';
                                    break;
                            }
                        }
                        msg = "\t" + errorMessage + " (\"" + imagePath + "\")";
                        errors += (errors === '') ? msg : "\n" + msg;
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/, { type: 'BULK_RESULT', errors: errors, result: result }];
                }
            });
        });
    };
    Utils.convertToJPEG = function (imageBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var image, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, jimp_1.default.read(imageBuffer)];
                                case 1:
                                    image = _a.sent();
                                    if (image.getMIME() !== 'image/jpeg') {
                                        image.getBuffer(jimp_1.default.MIME_JPEG, function (err, buffer) {
                                            if (err) {
                                                return reject(err);
                                            }
                                            resolve(buffer);
                                        });
                                    }
                                    else {
                                        resolve(imageBuffer);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    return [2 /*return*/, reject(e_2)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Utils.resizeImageToFit = function (imageBuffer, maxWidth, maxHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var image, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, jimp_1.default.read(imageBuffer)];
                                case 1:
                                    image = _a.sent();
                                    if (maxWidth > 0 && maxHeight > 0 && ((image.bitmap.width > maxWidth) || (image.bitmap.height > maxHeight))) {
                                        image.scaleToFit(maxWidth, maxHeight);
                                        image.getBuffer(jimp_1.default.MIME_JPEG, function (err, buffer) {
                                            if (err) {
                                                return reject(err);
                                            }
                                            resolve(buffer);
                                        });
                                    }
                                    else {
                                        resolve(imageBuffer);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_3 = _a.sent();
                                    return [2 /*return*/, reject(e_3)];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Utils.searchCategories = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results, i, result, e_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (category.trim() === '') {
                                        return [2 /*return*/, resolve(undefined)];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, market_rpc_1.MarketRPC.call('category', ['search', category])];
                                case 2:
                                    results = _a.sent();
                                    for (i = 0; i < results.length; i++) {
                                        result = results[i];
                                        if (result.parentItemCategoryId !== null && result.parentItemCategoryId !== 1) {
                                            return [2 /*return*/, resolve(result)];
                                        }
                                    }
                                    return [2 /*return*/, resolve(undefined)];
                                case 3:
                                    e_4 = _a.sent();
                                    reject(e_4);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Utils.convertToFloat = function (value) {
        var float = parseFloat(value);
        if (isNaN(float)) {
            throw new Error("Invalid number: " + value);
        }
        return float;
    };
    return Utils;
}());
exports.Utils = Utils;
