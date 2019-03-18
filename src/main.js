import 'babel-polyfill';
import Vue from 'vue';
import App from './app';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';

fastclick.attach(document.body);

new Vue({
    el:'#root',
    render:h=>h(App)
});