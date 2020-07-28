import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './util/reset.css'

//导入字体图标
import './assets/fonts/iconfont.css';

//全局配置axios
import axios from 'axios';
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
Vue.prototype.$http = axios;

//使用element-ui
import ele from './util/ElementUI';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
