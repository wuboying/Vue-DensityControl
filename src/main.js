import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antDesign from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import _http from './utils/axios'
import _api from './utils/api'
import _times from './assets/js/timeCycle.js'
import echarts from 'echarts'
import MkModular from './views/index.js'
Vue.use(MkModular);
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(antDesign);
Vue.prototype.$http = _http
Vue.prototype.$api = _api
Vue.prototype.$times = _times
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
