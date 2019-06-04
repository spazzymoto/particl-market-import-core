"use strict";
// import { Observable, from } from 'rxjs';
// import { map } from 'rxjs/operators';
Object.defineProperty(exports, "__esModule", { value: true });
// const req = require('request');
var got = require('got');
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
    return MarketRPC;
}());
exports.MarketRPC = MarketRPC;
