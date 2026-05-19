import axios from 'axios'
import message from '@/components/Message'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('sentinel_kb_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    const msg = err.response?.data?.message || err.message || "请求失败"
    switch (err.response?.status) {
      case 401:
        message.error("登录已过期，请重新登录")
        localStorage.removeItem('sentinel_kb_token')
        window.location.href = '/login'
        break
      case 403:
        message.error("暂无权限")
        break
      default:
        message.error(msg)
    }

    return Promise.reject(new Error(msg))
  }
)
export default service
