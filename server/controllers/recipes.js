const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')


recipesRouter.post('/', async (request, response) => {
  const { name, link, description, rating, lastMakingDate } = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }
  
  // Check that name isn't missing
  if (name) {
    const recipe = new Recipe({
      name,
      link,
      description,
      rating,
      lastMakingDate,
      userId: user._id
    })

    const savedRecipe = await recipe.save()
    user.recipes = user.recipes.concat(savedRecipe._id)
    await user.save()

    response.status(201).json(savedRecipe)
  } else { // Name is missing -> don't save the recipe
    response.status(400).end()
  }
})


module.exports = recipesRouter