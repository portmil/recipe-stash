const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')
const Category = require('../models/category')


recipesRouter.get('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }

  const recipes = await Recipe
    .find({userId : user.id}) // users can view only their own recipes
    .populate('categories', { name: 1, icon: 1 }) // include the id, name, and icon of a category
  response.json(recipes)
})


recipesRouter.get('/:id', async (request, response, next) => {
  const user = request.user
  try {
    const recipe = await Recipe
      .findById(request.params.id)
      .populate('categories', { name: 1, icon: 1 });
    if (!recipe) {
      return response.status(404).json({ error: 'recipe not found' })
    }
    if (!user || recipe.userId.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }

    // valid token and valid user
    response.json(recipe)

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


recipesRouter.post('/', async (request, response, next) => {
  const { name, link, description, cookingTime, rating, lastMakingDate } = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }

  const recipe = new Recipe({
    name,
    link,
    description,
    cookingTime,
    rating: rating || 0,
    lastMakingDate: lastMakingDate || new Date(0),
    userId: user._id
  })

  // The format of the data is validated by Mongoose's validation
  // functionality as specified in the recipe schema
  try {
    // Add the new recipe to the "All" category of the user
    const allCat = await Category.findOne({userId: user.id, name: 'All'})
    recipe.categories = [allCat._id]
    const savedRecipe = await recipe.save()
    allCat.unrankedRecipes = allCat.unrankedRecipes.concat(savedRecipe._id)
    await allCat.save()

    user.recipes = user.recipes.concat(savedRecipe._id)
    await user.save()

    response.status(201).json(savedRecipe)

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


recipesRouter.delete('/:id', async (request, response, next) => {
  const user = request.user
  const idToDelete = request.params.id
  try {
    const recipe = await Recipe.findById(idToDelete)
    if (!recipe) { // recipe has already been deleted
      return response.status(204).end()
    }
    if (!user || recipe.userId.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }

    // valid token and valid user
    await Recipe.findByIdAndRemove(idToDelete)
    user.recipes = user.recipes.filter(id => id.toString() !== idToDelete)
    await user.save()

    recipe.categories.forEach(async (catId) => { // remove recipe from categories
      const cat = await Category.findById(catId)
      cat.unrankedRecipes = cat.unrankedRecipes.filter(id => id.toString() !== idToDelete)
      cat.rankedRecipes = cat.rankedRecipes.filter(id => id.toString() !== idToDelete)
      await cat.save()
    })
    
    response.status(204).end()

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


module.exports = recipesRouter