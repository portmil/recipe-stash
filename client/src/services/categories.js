import axios from './axios';
import userService from '../services/user';
const baseUrl = '/api/categories';

const getAll = async () => {
  const response = await axios.get(baseUrl, userService.getAuthHeader());
  return response.data;
};

const categoryService = {
  getAll
};

export default categoryService;