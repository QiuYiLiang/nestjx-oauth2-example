import axios from 'axios'

axios.create({
  baseURL: '/api',
})

export async function request(...args: Parameters<typeof axios.post>) {
  return (await axios.post(...args)).data
}
