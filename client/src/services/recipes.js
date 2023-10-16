/* eslint-disable no-unused-vars */

let token = null;

/* eslint-enable no-unused-vars */

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const recipeService = {
  setToken,
};

export default recipeService;