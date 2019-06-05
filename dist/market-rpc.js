"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var got = require('got');
var FormData = require('form-data');
var MarketRPC = /** @class */ (function () {
    function MarketRPC() {
    }
    MarketRPC.call = function (method, params) {
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
                .catch(function (e) { return reject(e); });
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
    return MarketRPC;
}());
exports.MarketRPC = MarketRPC;
