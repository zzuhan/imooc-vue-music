import Vue from "vue";
import Router from "vue-router";
import Singer from "components/singer/singer";

const Recommend = () => import("components/recommend/recommend");

// 安装 Vue.js 插件。
// 该方法需要在调用 new Vue() 之前被调用。
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      component: Recommend
    },
    {
      path: "/singer",
      component: Singer
    }
  ]
});
