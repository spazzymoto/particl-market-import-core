"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var got = require('got');
var FormData = require('form-data');
var MarketRPC = /** @class */ (function () {
    function MarketRPC() {
    }
    MarketRPC.call = function (method, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var postData = {
                "method": method,
                "params": params,
                "id": 1,
                "jsonrpc": "2.0"
            };
            return got('http://localhost:3000/api/rpc', {
                auth: 'test:test',
                method: 'POST',
                json: true,
                body: postData
            })
                .then(function (res) { return resolve(res.body.result); })
                .catch(function (e) { return reject(_this.extractMPErrorMessage(e.body)); });
        });
    };
    MarketRPC.uploadImages = function (templateId, base64DataURIArray) {
        return new Promise(function (resolve, reject) {
            var form = new FormData();
            for (var idx = 0; idx < base64DataURIArray.length; idx++) {
                form.append("image-" + idx, Buffer.from(base64DataURIArray[idx].split(',')[1], 'base64'), {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg'
                });
            }
            return got("http://localhost:3000/api/item-images/template/" + templateId, {
                auth: 'test:test',
                method: 'POST',
                body: form
            })
                .then(function (res) { return resolve(res.body.result); })
                .catch(function (e) { return reject(e); });
        });
    };
    MarketRPC.extractMPErrorMessage = function (errorObj) {
        if (errorObj && typeof errorObj.message === 'string') {
            return errorObj.message;
        }
        else if (errorObj && Object.prototype.toString.call(errorObj.error) === '[object Object]') {
            return this.extractMPErrorMessage(errorObj.error);
        }
        return 'Invalid marketplace request';
    };
    return MarketRPC;
}());
exports.MarketRPC = MarketRPC;
