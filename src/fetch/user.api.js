import httpFetch from './index'

const baseUrl = '/user'

// 登陆
export const loginApi = (params) => {
    return httpFetch(`${baseUrl}/login`, params)
}

// 注册
export const registerApi = (params) => {
    return httpFetch(`${baseUrl}/register`, params)
}