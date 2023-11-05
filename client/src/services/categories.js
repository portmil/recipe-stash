import axios from './axios';
import userService from '../services/user';
const baseUrl = '/api/categories';

const getAll = async () => {
  const response = await axios.get(baseUrl, userService.getAuthHeader());
  return response.data;
};

const addCategory = async (category) => {
  const response = await axios.post(baseUrl, category, userService.getAuthHeader());
  return response.data;
};

const addRecipeToCategory = async (categoryId, recipeId) => {
  const response = await axios.patch(`${baseUrl}/${categoryId}/${recipeId}`, {}, userService.getAuthHeader());
  return response.data;
};

const deleteRecipeFromCategory = async (categoryId, recipeId) => {
  const response = await axios.delete(`${baseUrl}/${categoryId}/${recipeId}`, userService.getAuthHeader());
  return response.data;
};

const categoryService = {
  getAll,
  addCategory,
  addRecipeToCategory,
  deleteRecipeFromCategory
};

export default categoryService;