import axios from 'axios'
import {Message} from 'ant-design-vue'
let baseUrlDev = ''
const Axios = axios.create({
  baseURL: baseUrlDev,
  timeout: 1000000000000,
  responseType: "json",
  headers: {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/json",
    'access-control-allow-headers': '*'
  }
});

Axios.interceptors.request.use(config => {
       return config;
  
}, error => {  //请求错误处理

   Promise.reject(error)
});
Axios.interceptors.response.use(function (res) {
  // 返回响应时做一些处理
    return res.data;

}, function (error) {
  // 当响应异常时做一些处理
  return Promise.reject(error)

});

export default Axios

