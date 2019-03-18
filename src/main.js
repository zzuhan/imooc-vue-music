import 'babel-polyfill'; // 将整个库都导入进来：将该库导出的变量直接添加到本模块的命名空间中。三种导入方式之一。
import Vue from 'vue';
import App from './app';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';

fastclick.attach(document.body);

new Vue({
    el:'#root',
    render:h=>h(App)
});