import getJsonpPromise from "common/js/jsonp";
import { commonParams, options } from "./config";
import axios from "axios";

const debug = process.env.NODE_ENV != "production";

// 加载轮播图
export function getRecommend() {
  const url =
    "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });
  return getJsonpPromise(url, data, options);
}

// 加载推荐列表
export function getDiscList() {
  // 线上环境地址，同学们根据自己的需要配置修改
  const url = debug
    ? "/api/getDiscList"
    : "http://ustbhuangyi.com/music/api/getDiscList";

  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: "json"
  });

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
