const jwt = require('jsonwebtoken')
const User = require('../models/user')


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


// Checks that token is valid and places it into request.token
const tokenExtractor = (request, response, next) => {
  // get the token
  const authorization = request.get('Authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    const rawToken = authorization.replace('Bearer ', '')
    // check the token
    const decodedToken = jwt.verify(rawToken, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }
    // token is valid
    request.token = decodedToken
  }
  next()
}


// Places the id of the user making a request into request.user
const userExtractor = async (request, response, next) => {
  if (!request.token) { // the request does not contain a token
    next() // needed since otherwise execution of the code would stop here
    return // needed since next() does not skip the rest of the function
  }

  if (request.token.id) {
    request.user = await User.findById(request.token.id)
  }
  next()
}


module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}