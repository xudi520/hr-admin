
import axios from 'axios'
const requset = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})
export default requset
