import axios from './axios';
import userService from '../services/user';

const baseUrl = '/api/recipes';

const getAll = async () => {
  const response = await axios.get(baseUrl, userService.getAuthHeader());
  return response.data;
};

const getRecipe = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, userService.getAuthHeader());
  return response.data;
};

const addRecipe = async (recipe) => {
  const response = await axios.post(baseUrl, recipe, userService.getAuthHeader());
  return response.data;
};

const recipeService = {
  getAll,
  getRecipe,
  addRecipe,
};

export default recipeService;