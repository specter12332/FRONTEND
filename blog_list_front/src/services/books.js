import axios from 'axios'
const baseUrl = '/api/books'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (newBook) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBook, config)
  return response.data
}

const update = async (id, bookObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, bookObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, getOne, create, update, remove, setToken }