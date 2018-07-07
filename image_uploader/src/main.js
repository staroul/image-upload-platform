import Vue from 'vue';
import App from './app.vue';
import iView from 'iview';
import VueClipboard from 'vue-clipboard2';
import 'iview/dist/styles/iview.css'
import './assets/css/style.css';

Vue.use(iView);
Vue.use(VueClipboard);

new Vue({
    el: '#app',
    render: h => h(App)
});