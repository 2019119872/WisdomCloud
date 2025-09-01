import axios from 'axios'
import { message } from 'ant-design-vue'

/**
 * 创建 Axios 实例
 * 配置基础URL、超时时间和凭证携带选项
 */
const myAxios = axios.create({
  // baseURL: "",
  baseURL: 'http://localhost:8123',
  timeout: 60000,
  withCredentials: true,
})

/**
 * 全局请求拦截器
 * 在请求发送前和请求错误时执行相应的处理逻辑
 */
myAxios.interceptors.request.use(
  /**
   * 请求成功拦截处理
   * @param config - 请求配置对象
   * @returns 配置对象
   */
  function (config) {
    // Do something before request is sent
    return config
  },
  /**
   * 请求错误拦截处理
   * @param error - 请求错误对象
   * @returns 拒绝状态的Promise
   */
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

/**
 * 全局响应拦截器
 * 在响应返回时和响应错误时执行相应的处理逻辑
 */
myAxios.interceptors.response.use(
  /**
   * 响应成功拦截处理
   * @param response - 响应对象
   * @returns 响应对象
   */
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  /**
   * 响应错误拦截处理
   * @param error - 响应错误对象
   * @returns 拒绝状态的Promise
   */
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default myAxios
