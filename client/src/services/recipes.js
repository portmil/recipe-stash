import axios from './axios';
import userService from '../services/user';
const baseUrl = '/api/recipes';

const getAll = async () => {
  const response = await axios.get(baseUrl, userService.getAuthHeader());
  return response.data;
};

const recipeService = {
  getAll
};

export default recipeService;