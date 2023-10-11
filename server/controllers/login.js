const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')


loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is missing' })
  }

  const user = await User.findOne({ email })
  const credentialsCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!credentialsCorrect) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, email: user.email, name: user.name })
})


module.exports = loginRouter