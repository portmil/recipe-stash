const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const Recipe = require('../models/recipe')


categoriesRouter.get('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }

  const categories = await Category
    .find({userId : user.id}) // users can view only their own categories
  response.json(categories)
})


categoriesRouter.post('/', async (request, response, next) => {
  const { name, icon } = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }

  const category = new Category({
    name,
    icon: icon || 'all_icon',
    isDefault: false,
    userId: user._id
  })

  // The format of the data is validated by Mongoose's validation
  // functionality as specified in the recipe schema
  try {
    const savedCategory = await category.save()
    response.status(201).json(savedCategory)
  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


categoriesRouter.delete('/:id', async (request, response, next) => {
  const user = request.user
  const idToDelete = request.params.id
  try {
    const category = await Category.findById(idToDelete)
    if (!category) { // category has already been deleted
      return response.status(204).end()
    }
    if (!user || category.userId.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }
    if (category.isDefault) {
      return response.status(405).json({ error: 'cannot delete default categories' })
    } // status code 405 = Method Not Allowed

    await Category.findByIdAndRemove(idToDelete)

    // Remove the category from the recipes that are in it
    const recipes = category.unrankedRecipes.concat(category.rankedRecipes)
    recipes.forEach(async (recipeId) => {
      const recipe = await Recipe.findById(recipeId)
      recipe.categories = recipe.categories.filter(id => id.toString() !== idToDelete)
      await recipe.save()
    })

    response.status(204).end()

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


// Changing the ranking of recipes in a category
categoriesRouter.patch('/:id', async (request, response, next) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid user: no token provided' })
  }

  try {
    const id = request.params.id
    const category = await Category.findById(id)
    if (!category) {
      return response.status(404).json({ error: 'category not found' })
    }
    if (category.userId.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }

    const { rankedRecipes, unrankedRecipes } = request.body
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { rankedRecipes, unrankedRecipes },
      { new: true }
    )
    response.json(updatedCategory)

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


// Adding recipes to a category
categoriesRouter.patch('/:id/:recipeId', async (request, response, next) => {
  const user = request.user
  const id = request.params.id
  const recipeId = request.params.recipeId
  try {
    const category = await Category.findById(id)
    if (!category) {
      return response.status(404).json({ error: 'category not found' })
    }
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return response.status(404).json({ error: 'recipe not found' })
    }
    if (!user || category.userId.toString() !== user.id.toString() || category.userId.toString() !== recipe.userId.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }
    const recipesInCategory = category.unrankedRecipes.concat(category.rankedRecipes)
    if (recipesInCategory.map(r => r.toString()).includes(recipeId)) {
      return response.status(405).json({ error: 'the recipe has already been added to this category' })
    }
    
    // All checks pass -> add the recipe to the category
    recipe.categories = recipe.categories.concat(id)
    await recipe.save()
    const update = { unrankedRecipes: category.unrankedRecipes.concat(recipeId) }
    const updatedCategory = await Category.findByIdAndUpdate(id, update, { new: true })
    response.json(updatedCategory)

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


// Removing recipes from a category
categoriesRouter.delete('/:id/:recipeId', async (request, response, next) => {
  const user = request.user
  const id = request.params.id
  const recipeId = request.params.recipeId
  try {
    const category = await Category.findById(id)
    if (!category) {
      return response.status(404).json({ error: 'category not found' })
    }
    if (category.name === 'All') {
      return response.status(405).json({ error: 'cannot remove recipes from the category \'All\'' })
    }
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return response.status(404).json({ error: 'recipe not found' })
    }
    if (!user || category.userId.toString() !== user.id.toString() || category.userId.toString() !== recipe.userId.toString()) {
      return response.status(401).json({ error: 'invalid user' })
    }

    // All checks pass -> remove the recipe from the category
    recipe.categories = recipe.categories.filter(catId => catId.toString() !== id)
    await recipe.save()
    
    const update = {
      unrankedRecipes: category.unrankedRecipes.filter(id => id.toString() !== recipeId),
      rankedRecipes: category.rankedRecipes.filter(id => id.toString() !== recipeId),
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, update, { new: true })
    response.json(updatedCategory)

  } catch (error) {
    next(error) // give error to error handler middleware
  }
})


module.exports = categoriesRouter