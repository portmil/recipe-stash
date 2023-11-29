const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Category = require('../models/category')


usersRouter.post('/', async (request, response, next) => {
  const { name, email, password } = request.body

  if (!password) {
    return response.status(400).json({
      error: 'password is missing'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    email,
    passwordHash,
  })

  try {
    const savedUser = await user.save()

    // Create default categories on registration
    const defaultCategories = [
      'All',
      'Breakfast',
      'Dinner',
      'Dessert',
      'Salad',
      'Soup',
      'Pasta',
    ]
    for (const categoryName of defaultCategories) {
      const newCategory = new Category({
        name: categoryName,
        icon: `${categoryName.toLowerCase()}_icon`,
        isDefault: true,
        userId: savedUser._id
      })
      await newCategory.save()
    }

    response.status(201).json(savedUser)
  } catch(error) {
    next(error) // give error to error handler middleware
  }
})


module.exports = usersRouter