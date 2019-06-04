// import { Observable, from } from 'rxjs';
// import { map } from 'rxjs/operators';

// const req = require('request');
const got = require('got');

export class MarketRPC {

  static call(method: string, params?: Array<any> | null) {
    const postData = {
      "method": method,
      "params": params,
      "id": 1,
      "jsonrpc": "2.0"
    }

    return got('http://localhost:3000/api/rpc', {
      auth: 'test:test',
      method: 'POST',
      json: true,
      body:postData
    });
  }
}