const got = require('got');
const FormData = require('form-data');

export class MarketRPC {

  static call(method: string, params?: Array<any> | null): Promise<any> {
    return new Promise((resolve, reject) => {
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
          body: postData
        })
        .then((res: any) => resolve(res.body.result))
        .catch((e: any) => reject(e));
    });
  }

  static uploadImages(templateId: number, base64DataURIArray: any[]) {
    return new Promise((resolve, reject) => {

      const form = new FormData();

      for (let idx = 0; idx < base64DataURIArray.length; idx++) {
        form.append(
          `image-${idx}`,
          Buffer.from(base64DataURIArray[idx].split(',')[1], 'base64'),
          {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
          });
      }

      return got(`http://localhost:3000/api/item-images/template/${templateId}`, {
            auth: 'test:test',
            method: 'POST',
            body: form
          })
          .then((res: any) => resolve(res.body.result))
          .catch((e: any) => reject(e));
    });
  }
}