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
var csvtojson_1 = __importDefault(require("csvtojson"));
var fs_1 = __importDefault(require("fs"));
var rxjs_1 = require("rxjs");
var BaseCSV = /** @class */ (function () {
    function BaseCSV() {
    }
    BaseCSV.prototype.load = function (params) {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) { return __awaiter(_this, void 0, void 0, function () {
            var listings, text, csvData, _i, csvData_1, item, transformed, _a, _b, _c, key, mappedKey, transformFunction, transformResult, errorMessage, e_1, errorMessage;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.importParams = params;
                        listings = [];
                        return [4 /*yield*/, fs_1.default.readFileSync(params.file, "utf8")];
                    case 1:
                        text = _d.sent();
                        return [4 /*yield*/, csvtojson_1.default({
                                delimiter: params.delimiter || ","
                            }).fromString(text)];
                    case 2:
                        csvData = _d.sent();
                        if (csvData.length === 0) {
                            return [2 /*return*/, listings];
                        }
                        try {
                            this.checkImportMapping(csvData);
                        }
                        catch (e) {
                            observer.error(e.message);
                            observer.complete();
                            return [2 /*return*/];
                        }
                        _i = 0, csvData_1 = csvData;
                        _d.label = 3;
                    case 3:
                        if (!(_i < csvData_1.length)) return [3 /*break*/, 15];
                        item = csvData_1[_i];
                        observer.next({ status: "Hang on, we are busy importing listing " + (listings.length + 1) + "/" + csvData.length });
                        transformed = {
                            validationError: ''
                        };
                        _a = [];
                        for (_b in this.importMapping)
                            _a.push(_b);
                        _c = 0;
                        _d.label = 4;
                    case 4:
                        if (!(_c < _a.length)) return [3 /*break*/, 13];
                        key = _a[_c];
                        mappedKey = void 0;
                        transformFunction = void 0;
                        switch (typeof this.importMapping[key]) {
                            case 'string':
                                mappedKey = this.importMapping[key];
                                break;
                            case 'object':
                                mappedKey = this.importMapping[key].field;
                                transformFunction = this.importMapping[key].translate;
                                break;
                        }
                        if (!mappedKey) return [3 /*break*/, 11];
                        if (!transformFunction) return [3 /*break*/, 9];
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, transformFunction(item[mappedKey])];
                    case 6:
                        transformResult = _d.sent();
                        if (typeof transformResult === 'object' && transformResult.hasOwnProperty('type') && transformResult.type === 'BULK_RESULT') {
                            transformed[key] = transformResult.result;
                            if (transformResult.errors.trim() !== '') {
                                errorMessage = "Field " + key + " had the following error(s):\n" + transformResult.errors;
                                transformed.validationError += (transformed.validationError === '') ? errorMessage : "\n" + errorMessage;
                            }
                        }
                        else {
                            transformed[key] = transformResult;
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _d.sent();
                        transformed[key] = undefined;
                        errorMessage = "Field " + key + " had the following error(s):\n\t" + e_1.message;
                        transformed.validationError += (transformed.validationError === '') ? errorMessage : "\n" + errorMessage;
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        transformed[key] = item[mappedKey];
                        _d.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        transformed[key] = undefined;
                        _d.label = 12;
                    case 12:
                        _c++;
                        return [3 /*break*/, 4];
                    case 13:
                        transformed.publish = true;
                        listings.push(transformed);
                        _d.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 3];
                    case 15:
                        observer.next({ result: listings });
                        observer.complete();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BaseCSV.prototype.checkImportMapping = function (data) {
        var testData = data[0];
        for (var key in this.importMapping) {
            if (this.importMapping.hasOwnProperty(key)) {
                var mappedKey = void 0;
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
                    throw new Error("Unable to find the column \"" + mappedKey + "\" in csv file.");
                }
            }
        }
    };
    BaseCSV.prototype.getimportParam = function (name) {
        return this.importParams[name];
    };
    return BaseCSV;
}());
exports.BaseCSV = BaseCSV;
