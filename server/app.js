const config = require('./utils/config')
const express = require("express")
const app = express()
const cors = require('cors')
const recipesRouter = require('./controllers/recipes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.use('/api/recipes',
  middleware.tokenExtractor,
  middleware.userExtractor,
  recipesRouter
)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app