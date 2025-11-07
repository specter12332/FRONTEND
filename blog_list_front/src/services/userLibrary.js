import axios from 'axios';

const baseUrl = '/api/user/books';

let token = null;

export const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

export const saveBookToLibrary = async ({ userId, bookId }) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, { userId, bookId }, config);
  return response.data;
};

export const getUserLibrary = async (userId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(`${baseUrl}/${userId}`, config);
  return response.data;
};
