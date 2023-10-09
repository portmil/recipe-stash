import axios from './axios';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const recipeService = {
	setToken,
};
export default recipeService;