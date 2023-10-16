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
    const all = new Category({
      name: 'All',
      icon: 'all_icon',
    })
    const breakfast = new Category({
      name: 'Breakfast',
      icon: 'breakfast_icon',
    })
    const defaultCats = [all, breakfast]
    defaultCats.forEach( async (cat) => {
      cat.isDefault = true
      cat.userId = savedUser._id
      await cat.save()
    })

    response.status(201).json(savedUser)
  } catch(error) {
    next(error) // give error to error handler middleware
  }
})


module.exports = usersRouter