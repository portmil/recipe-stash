import axios from './axios';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAuthHeader = () => {
  return {
    headers: { Authorization: token },
  };
};

const login = async (credentials) => {
  const response = await axios.post('/api/login', credentials);
  return response.data;
};

const signup = async (credentials) => {
  const response = await axios.post('/api/users', credentials);
  return response.data;
};
  
const userService = {
  setToken,
  getAuthHeader,
  login,
  signup
};

export default userService;