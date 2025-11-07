import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/comments'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getCommentsForBook = async (bookId) => {
  const response = await axios.get(`${baseUrl}/book/${bookId}`)
  return response.data
}

const create = async (commentData) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, commentData, config)
  return response.data
}

const remove = async (commentId) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${commentId}`, config)
  return response.data
}

export default { getCommentsForBook, create, remove, setToken }