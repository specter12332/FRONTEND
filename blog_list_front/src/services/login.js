import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/contacts/login'

const login = async ({ correo, contraseña }) => {
  const response = await axios.post(baseUrl, { correo, contraseña }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return response.data
}

export default { login }