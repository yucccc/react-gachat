import axios     from 'axios'
import qs        from 'qs'
import { Toast } from 'antd-mobile';

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 错误提示
function offline(duration, content = '发生错误 !') {
    Toast.offline(content, duration, null, false);
}
// 请求拦截
axios.interceptors.request.use(config => {

        Toast.loading('请求数据中...', 0)

        if (config.method === "post" || config.method === "put" || config.method === "delete") {
            // 序列化
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    // 发生错误
    error => {
        offline()
        return Promise.reject(error.data.error.message);
    });

// 响应拦截
axios.interceptors.response.use(config => {
    Toast.hide()
    return config
})

export default function fetch(url, params = {}, method = 'get') {
    // 处理不同请求方式的传参格式
    if (method === 'get') {
        params = {params}
    }
    return new Promise((resolve, reject) => {

        axios[method](url, params).then(res => {

            // 后端code 不为 0 抛出提示 =>  这里我后端定义的是 0 即时正常数据
            // 请根据实际应用进行调整
            res.data.code && Toast.info(res.data.msg, 1, null, true)

            resolve(res.data)


        }).catch(error => {
            offline(2, '接口异常')
            reject(error)
        })
    })
}

