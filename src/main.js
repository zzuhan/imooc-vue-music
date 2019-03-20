import "babel-polyfill"; // 将整个库都导入进来：将该库导出的变量直接添加到本模块的命名空间中。三种导入方式之一。
import Vue from "vue";
import App from "./app";
import router from "./router";
import fastclick from "fastclick";
import VueLazyload from "vue-lazyload";
import "common/stylus/index.styl";

fastclick.attach(document.body);
// 安装Vue-Lazyload懒加载插件
Vue.use(VueLazyload, {
  loading: require("common/image/default.png") // webpack会将图片转为base64字符串
});

new Vue({
  el: "#root",
  router,
  render: h => h(App)
});
