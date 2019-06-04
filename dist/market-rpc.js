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
        });
    };
    return MarketRPC;
}());
exports.MarketRPC = MarketRPC;
