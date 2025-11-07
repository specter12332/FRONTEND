import axios from 'axios'
const baseUrl = '/api/blogs'
const commentUrl = '/api/comments'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}/likes`, updatedObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

// Nuevas funciones para comentarios
const getComments = async (bookId) => {
  const response = await axios.get(`${commentUrl}/book/${bookId}`)
  return response.data
}

const createComment = async (bookId, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(commentUrl, {
    ...comment,
    bookId
  }, config)
  return response.data
}

const deleteComment = async (commentId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${commentUrl}/${commentId}`, config)
  return response.data
}

export default { 
  getAll, 
  remove, 
  setToken, 
  create, 
  update,
  getComments,
  createComment,
  deleteComment
}