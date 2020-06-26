import axios from 'axios'

const api = axios.create({
  baseURL: 'https://riot-backend.herokuapp.com/',
})

export default api
