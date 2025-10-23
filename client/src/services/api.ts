import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password })
  return response.data
}

export const getArticles = async () => {
  const response = await api.get('/articles')
  return response.data
}

export const getArticleById = async (id: string) => {
  const response = await api.get(`/articles/${id}`)
  return response.data
}

export const createArticle = async (article: any) => {
  const response = await api.post('/articles', article)
  return response.data
}

export const updateArticle = async (id: string, article: any) => {
  const response = await api.put(`/articles/${id}`, article)
  return response.data
}

export const deleteArticle = async (id: string) => {
  const response = await api.delete(`/articles/${id}`)
  return response.data
}

