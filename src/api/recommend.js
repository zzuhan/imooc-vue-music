import getJsonpPromise from "common/js/jsonp";
import { commonParams,options } from "./config";

const debug = process.env.NODE_ENV != "production";

export function getRecommend() {
  const url =
    "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });
  return getJsonpPromise(url,data,options);
}
