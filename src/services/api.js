import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8050/',
})

export default api
