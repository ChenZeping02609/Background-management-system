import axios from 'axios';

import { Guid } from './guid'
// 获取设备id
let DeviceID = localStorage.DeviceID;
if (!DeviceID) {
    DeviceID = Guid.NewGuid().ToString('D');
    localStorage.DeviceID = DeviceID;
}
let ID = DeviceID;
// console.log(ID)

// axios.defaults.baseURL = 'http://wap.365msmk.com';
axios.defaults.baseURL = 'http://120.53.31.103:84'

//添加请求拦截器
axios.interceptors.request.use(function (config){
    config.headers={
        DeviceID:ID,
        DeviceType:"H5"
    }
    //在请求之前做什么
    return config;
},function(error){
    //请求错误做什莫
    return Promise.reject(error);
})

//导出
export default axios;