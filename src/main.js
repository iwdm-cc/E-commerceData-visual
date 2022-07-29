import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


import  SocketService from './utils/socket_service'
//对服务端进行webSocket的连接
SocketService.Instance.connect()

//引入字体文件
import './assets/font/iconfont.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
//将axios对象挂载到vue原型上
//别的组件中，使用$http
Vue.prototype.$http = axios
Vue.prototype.$socket = SocketService.Instance

//将全局echarts对象挂载到vue原型上
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
