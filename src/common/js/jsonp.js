import jsonp from "jsonp";

// 创建jsonp Promise
export default function getJsonpPromise(url, data, option) {
  url += (url.indexOf("?") < 0 ? "?" : "&") + getQueryUrl(data);
  return new Promise((resolve, reject) => {
    jsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

// 将Object转化成查询字符串
export function getQueryUrl(data) {
  let queryUrl = "";
  for (let k in data) {
    let val = data[k] !== undefined ? data[k] : "";
    queryUrl += "&" + k + "=" + encodeURIComponent(val);
  }
  return queryUrl ? queryUrl.substring(1) : "";
}
