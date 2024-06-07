import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
})

// 优先都使用 post
export async function request(...args: Parameters<typeof axios.post>) {
  return (await axiosInstance.post(...args)).data
}

export async function requestGet(...args: Parameters<typeof axios.get>) {
  return (await axiosInstance.get(...args)).data
}
